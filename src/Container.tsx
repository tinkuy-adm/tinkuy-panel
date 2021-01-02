import React, {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./App.css";
import MapContainer from "./MapContainer";
import {
  getClustersPoints,
  getPeoplePoints,
  getEntitiesPlaces,
} from "./api/dinnamodb";
import { AuthContext } from "./context/auth.context";
import { logout } from "./context/auth.actions";
import {
  PeoplePos,
  PeopleStatus,
  DataSource,
  PoliceStation,
  Cluster,
} from "./schema";
import { Logout, Refresh, MenuColored, Close } from "./components/icons";
import { STATUS_FILL_COLORS, STATUS_BORDER_COLORS } from "./constants";

import {
  Stack,
  Inline,
  Button,
  Corners,
  Color,
  Text,
  TextSize,
  ButtonVariant,
  Frame,
  Shadow,
  TextWeight,
  Tooltip,
  Icon,
  Touchable,
  TextInput,
  Spacer,
  Inset,
} from "@ableco/baseline";

const countPointsByType = (dots: PeoplePos[], pstat: PeopleStatus) => {
  const count = dots.reduce((pv, cv) => {
    if (
      (cv.status && cv.status === pstat.toLowerCase()) ||
      (!cv.status && pstat.toLowerCase() === PeopleStatus.OK)
    ) {
      return pv + 1;
    } else {
      return pv;
    }
  }, 0);
  return count;
};

function Container() {
  const [people, setPeople] = useState<PeoplePos[]>([]);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [policeStations, setPoliceStations] = useState<PoliceStation[]>([]);
  const [filters, setFilters] = useState<PeopleStatus[]>(
    Object.keys(PeopleStatus).map((p) => p.toLowerCase()) as PeopleStatus[]
  );
  const [source, setSource] = useState<DataSource>(DataSource.PROD);
  const [showClusters, setShowClusters] = useState(true);
  const [clickedCoords, setClickedCoords] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 0, lng: 0 });
  const [timeOffset, setTimeOffset] = useState(60);
  const [timeOffsetValue, setTimeOffsetValue] = useState(60);
  const [controlToggled, setControlToggled] = useState(false);
  const $numberInputRef = useRef<HTMLInputElement>();

  const authCtx = useContext(AuthContext);

  const userName = useMemo(() => {
    const userEmail = authCtx.state.user?.email;
    return userEmail ? userEmail.split("@")[0] : "";
  }, [authCtx]);

  useEffect(
    function syncAfterUserStopsWriting() {
      // do nothing if they are already equal
      if (timeOffset === timeOffsetValue) return;
      const timer = setTimeout(() => {
        setTimeOffset(timeOffsetValue);
        $numberInputRef.current?.blur();
      }, 1000);
      return () => clearTimeout(timer);
    },
    [timeOffsetValue, timeOffset, setTimeOffset, $numberInputRef]
  );

  useEffect(() => {
    getEntitiesPlaces({
      source: source,
      entity: "POL",
      callback: (data) => {
        setPoliceStations(data);
      },
    });
  }, []);

  const handleRefreshPoints = useCallback(
    function refreshPoints() {
      getPeoplePoints({
        source: source,
        userName: userName,
        timeOffset: timeOffset,
        callback: (dots) => {
          setPeople(dots);
        },
      });
      getClustersPoints({
        source: source,
        userName: userName,
        timeOffset: timeOffset,
        callback: (dots) => {
          setClusters(dots);
        },
      });
    },
    [setPeople, setClusters, userName, timeOffset]
  );

  const toggleControl = useCallback(
    function toggleControl() {
      setControlToggled(!controlToggled);
    },
    [controlToggled, setControlToggled]
  );

  const handleChangeSource = useCallback(
    function handleChangeSource(ev) {
      setSource(ev.target.value);
    },
    [setSource]
  );

  const handleFilterChange = useCallback(
    function handleFilterChange(ev) {
      const name = ev.target.value;
      if (filters.includes(name.toLowerCase())) {
        const newFilters = filters.filter((f) => f !== name);
        setFilters(newFilters);
      } else {
        setFilters((pV) => [...pV, name]);
      }
    },
    [setFilters, filters]
  );

  const handleTimeOffsetChange = useCallback(
    function handleTimeOffsetChange(ev) {
      setTimeOffsetValue(ev.target.value);
    },
    [setTimeOffsetValue]
  );

  const onTimeOffsetBlur = useCallback(
    function onTimeOffsetBlur() {
      setTimeOffset(timeOffsetValue);
      getPeoplePoints({
        source: source,
        userName: userName,
        timeOffset: timeOffsetValue,
        callback: (dots) => {
          setPeople(dots);
        },
      });
      getClustersPoints({
        source: source,
        userName: userName,
        timeOffset: timeOffset,
        callback: (dots) => {
          setClusters(dots);
        },
      });
    },
    [setTimeOffset, setPeople, timeOffsetValue, source, userName]
  );

  useEffect(() => {
    handleRefreshPoints();
  }, [source]);

  useEffect(() => {
    if (userName !== "admin") setShowClusters(false);
  }, [userName]);

  return (
    <Frame>
      {controlToggled ? (
        <Touchable
          border={Color.Transparent}
          style={{ top: 20, left: 20 }}
          className="absolute z-10"
          onClick={toggleControl}
        >
          <Icon>
            <MenuColored width={50} height={50} />
          </Icon>
        </Touchable>
      ) : (
        <Frame className="absolute z-10 top-0 left-0" p={4}>
          <Stack
            style={{ width: 300 }}
            p={4}
            space={3}
            bg={Color.White}
            shadow={Shadow.ExtraLarge}
            corners={Corners.LargeRounded}
          >
            <Inline space={2} className="justify-between">
              <Text
                color={Color.Primary}
                weight={TextWeight.SemiBold}
                size={TextSize.LG}
              >
                {userName.charAt(0).toUpperCase() + userName.slice(1)}
              </Text>
              <Touchable border={Color.Transparent} onClick={toggleControl}>
                <Icon color={Color.Primary}>
                  <Close width={30} height={30} />
                </Icon>
              </Touchable>
            </Inline>
            <Stack space={2} className="w-56">
              <Inline>
                <Text size={TextSize.LG} weight={TextWeight.Bold}>
                  Filtros
                </Text>
              </Inline>
              <Stack space={1}>
                <Text size={TextSize.SM} weight={TextWeight.SemiBold}>
                  Por estado
                </Text>
                {Object.keys(PeopleStatus).map((ps, idx) => (
                  <Inline space={2} key={`pp_${idx}`}>
                    <input
                      type="checkbox"
                      checked={filters.includes(
                        ps.toLowerCase() as PeopleStatus
                      )}
                      value={ps.toLowerCase()}
                      onChange={handleFilterChange}
                    />
                    <Text size={TextSize.SM}>
                      {ps} ({countPointsByType(people, ps as PeopleStatus)})
                    </Text>
                    <Spacer />
                    <Frame
                      className="w-3 h-3"
                      corners={Corners.FullRounded}
                      bg={STATUS_FILL_COLORS[ps.toLowerCase() as PeopleStatus]}
                      border={
                        STATUS_BORDER_COLORS[ps.toLowerCase() as PeopleStatus]
                      }
                    />
                  </Inline>
                ))}
                {userName === "admin" ? (
                  <Inline space={2}>
                    <input
                      type="checkbox"
                      checked={showClusters}
                      onChange={() => setShowClusters((pV) => !pV)}
                    />
                    <Text size={TextSize.SM}>Clusters</Text>
                    <Spacer />
                    <Frame
                      className="w-3 h-3"
                      corners={Corners.FullRounded}
                      bg={STATUS_FILL_COLORS.cluster}
                      border={STATUS_BORDER_COLORS.cluster}
                    />
                  </Inline>
                ) : null}
              </Stack>
              <Stack p={[2, 0, 0, 0]} space={2}>
                <Text size={TextSize.SM} weight={TextWeight.SemiBold}>
                  Por Tiempo
                </Text>
                <Inline space={1}>
                  <Text size={TextSize.SM}>Ultimos</Text>
                  <TextInput
                    innerRef={$numberInputRef}
                    p={1}
                    className="w-16"
                    min={0}
                    type="number"
                    border={Color.Primary}
                    corners={Corners.LargeRounded}
                    value={timeOffsetValue}
                    onChange={handleTimeOffsetChange}
                    onBlur={onTimeOffsetBlur}
                  />
                  <Text size={TextSize.SM}> minutos</Text>
                </Inline>
              </Stack>
            </Stack>
            <Inline className="justify-between">
              <Button
                variant={ButtonVariant.Outline}
                corners={Corners.MediumRounded}
                onClick={handleRefreshPoints}
              >
                <Inline space={1}>
                  <Text size={TextSize.SM} color={Color.Primary}>
                    Refrescar
                  </Text>
                  <Icon color={Color.Primary}>
                    <Refresh width={14} height={14} />
                  </Icon>
                </Inline>
              </Button>
            </Inline>
            <Stack>
              <Text size={TextSize.SM}>Coordenadas clickeadas:</Text>
              <Text size={TextSize.SM}>
                ({clickedCoords.lat}, {clickedCoords.lng})
              </Text>
            </Stack>
            {userName === "admin" ? (
              <Inline>
                <select value={source} onChange={handleChangeSource}>
                  <option value="QAS">QAS</option>
                  <option value="PROD">PROD</option>
                </select>
              </Inline>
            ) : null}
            <Inline className="w-full">
              <Button
                corners={Corners.LargeRounded}
                block
                color={Color.Primary}
                onClick={() => logout(authCtx.dispatch)}
              >
                <Text size={TextSize.SM} color={Color.White}>
                  Cerrar sesión
                </Text>
              </Button>
            </Inline>
          </Stack>
        </Frame>
      )}

      <div className="w-screen h-screen">
        <MapContainer
          onClickedOnMap={(lat: number, lng: number) =>
            setClickedCoords({ lat, lng })
          }
          clusters={showClusters ? clusters : []}
          peopleDots={people.filter((p) =>
            p.status
              ? filters.includes(p.status)
              : filters.includes(PeopleStatus.OK)
          )}
          policeStations={policeStations}
        />
      </div>
      {controlToggled ? (
        <Inset p={[8, 16]} variant="absolute" position="bottom right">
          <Touchable
            corners={Corners.FullRounded}
            bg={Color.Success}
            border={Color.Transparent}
            onClick={handleRefreshPoints}
            p={4}
          >
            <Icon color={Color.White}>
              <Refresh width={30} height={30} />
            </Icon>
          </Touchable>
        </Inset>
      ) : null}
    </Frame>
  );
}

export default Container;
