import GoogleMap from "google-map-react";
import React, { useMemo } from "react";
import { Cluster, PeoplePos, PeopleStatus, PoliceStation } from "./schema";
import {
  Tooltip,
  Stack,
  Inline,
  Text,
  Color,
  Corners,
  TextSize,
  Frame,
  TextWeight,
  Icon,
} from "@ableco/baseline";
import { STATUS_FILL_COLORS, STATUS_BORDER_COLORS } from "./constants";
import { PoliceStation as PoliceStationIcon } from "./components/icons";

type MapContainerProps = {
  peopleDots: PeoplePos[];
  clusters: Cluster[];
  policeStations: PoliceStation[];
  onClickedOnMap: (lat: number, lng: number) => void;
};

type PeopleMapPointProps = {
  lat: any;
  lng: any;
  type: "people_dot" | "cluster_dot";
  status?: PeopleStatus;
  tstamp?: number;
  name?: string;
};

type EntitiesMapPointProps = {
  lat: number;
  lng: number;
  name: string;
  direction: string;
  district: string;
};

function EntitiesMapPoint({
  lat,
  lng,
  name,
  direction,
  district,
}: EntitiesMapPointProps) {
  return (
    <Tooltip
      bg={Color.Black}
      corners={Corners.LargeRounded}
      p={4}
      label={
        <Stack space={2}>
          <Inline>
            <Text
              color={Color.White}
              size={TextSize.SM}
              weight={TextWeight.SemiBold}
            >
              {name} ({district})
            </Text>
          </Inline>

          <Inline>
            <Text color={Color.Neutral200} size={TextSize.XS}>
              {direction}
            </Text>
          </Inline>
        </Stack>
      }
    >
      <Frame className="w-3 h-3 z-0" corners={Corners.FullRounded}>
        <Icon>
          <PoliceStationIcon width={15} height={15} />
        </Icon>
      </Frame>
    </Tooltip>
  );
}

function PeopleMapPoint({
  lat,
  lng,
  type,
  status,
  name,
  tstamp,
}: PeopleMapPointProps) {
  const fillColor =
    type === "cluster_dot"
      ? Color.PrimaryLight
      : STATUS_FILL_COLORS[status ?? "ok"];
  const bordercolor =
    type === "cluster_dot"
      ? Color.Primary
      : STATUS_BORDER_COLORS[status ?? "ok"];

  // Create a new JavaScript Date object based on the timestamp
  // multiplied by 1000 so that the argument is in milliseconds, not seconds.
  var date = tstamp ? new Date(tstamp * 1000) : new Date();
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();

  // Will display time in 10:30:23 format
  var formattedTime = hours + ":" + minutes.substr(-2);

  return (
    <Tooltip
      bg={Color.Black}
      corners={Corners.LargeRounded}
      p={4}
      label={
        <Stack space={2}>
          {name ? (
            <Inline>
              <Text
                color={Color.White}
                size={TextSize.SM}
                weight={TextWeight.SemiBold}
              >
                {name}
              </Text>
            </Inline>
          ) : null}
          <Inline>
            <Text color={Color.Neutral200} size={TextSize.XS}>
              Ultimo: {formattedTime}
            </Text>
          </Inline>
        </Stack>
      }
      place="top"
    >
      <Frame
        style={{ width: 10, height: 10 }}
        className="border-2"
        bg={fillColor}
        border={bordercolor}
        corners={Corners.FullRounded}
      />
    </Tooltip>
  );
}

export default function MapContainer({
  peopleDots,
  clusters,
  policeStations,
  onClickedOnMap,
}: MapContainerProps) {
  const sourcePoints = useMemo(() => {
    return clusters
      .filter((c) => c.cluster_id === "activo")
      .reduce((pv, cv) => {
        const vals: any = [];
        cv.points.forEach((p) => {
          vals.push({ lat: p.values[0], lng: p.values[1] });
        });
        return [...pv, ...vals];
      }, [] as { lat: string; lng: string }[]);
  }, [clusters]);

  const onChange = (map: any) => {
    // @todo limit the points to only what is inside the bounds
    // console.log(map.bounds);
  };

  return (
    <GoogleMap
      bootstrapURLKeys={{ key: process.env.REACT_APP_G_API_KEY || "   " }}
      center={{ lat: -12.0464, lng: -77.0428 }}
      defaultZoom={11}
      onChange={onChange}
      onClick={({ lat, lng }) => onClickedOnMap(lat, lng)}
    >
      {policeStations.map((station, idx) => (
        <EntitiesMapPoint
          key={`${idx}_pol`}
          lat={station.latitud}
          lng={station.longitud}
          name={station.nombre}
          direction={station.direccion}
          district={station.distrito}
        />
      ))}
      {peopleDots.map((p, idx) => (
        <PeopleMapPoint
          key={`${idx}_pp`}
          lat={p.latitud}
          lng={p.longitud}
          type="people_dot"
          status={p.status}
          name={p.name}
          tstamp={p.tstamp}
        />
      ))}
      {sourcePoints.map((p, idx) => (
        <PeopleMapPoint
          key={`${idx}_cc`}
          lat={p.lat}
          lng={p.lng}
          type="cluster_dot"
        />
      ))}
    </GoogleMap>
  );
}
