import * as AWS from "aws-sdk";
import { DataSource } from "../schema";

const TABLES = {
  PIPOL: process.env.REACT_APP_PEOPLE_TABLE || "tinkuy-coords",
  CLUSTERS: process.env.REACT_APP_CLUSTER_TABLE || "tinkuy-clusters",
  ORGS: process.env.REACT_APP_ORGS_TABLE || "orgs-coords",
  PIPOL_QAS: process.env.REACT_APP_PEOPLE_TABLE_QAS || "tinkuy-coords-qas",
  CLUSTERS_QAS:
    process.env.REACT_APP_CLUSTER_TABLE_QAS || "tinkuy-clusters-qas",
  ORGS_QAS: process.env.REACT_APP_ORGS_TABLE || "orgs-coords-qas",
};

const aws_remote_config = {
  accessKeyId: process.env.REACT_APP_AWS_KEY,
  secretAccessKey: process.env.REACT_APP_SECRET_KEY,
  region: process.env.REACT_APP_REGION,
};

type PeoplePointsProps = {
  source: DataSource;
  userName: string;
  timeOffset: number;
  callback: (data: any) => void;
};

type ClusterPointsProps = {
  source: DataSource;
  userName: string;
  timeOffset: number;
  callback: (data: any) => void;
};

type EntitiesPlacesProps = {
  source: DataSource;
  entity: string;
  callback: (data: any) => void;
};

export function getPeoplePoints({
  source,
  userName,
  timeOffset,
  callback,
}: PeoplePointsProps) {
  AWS.config.update(aws_remote_config);

  const docClient = new AWS.DynamoDB.DocumentClient();

  if (userName === "admin") {
    const params = {
      TableName: source === DataSource.PROD ? TABLES.PIPOL : TABLES.PIPOL_QAS,
      FilterExpression: "tstamp >= :t",
      ExpressionAttributeValues: {
        ":t": Math.floor(Date.now() / 1000) - timeOffset * 60,
      },
    };

    docClient.scan(params, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        const { Items } = data;
        callback(Items?.filter((item) => item.latitud && item.longitud));
      }
    });
  } else {
    const params = {
      TableName: source === DataSource.PROD ? TABLES.PIPOL : TABLES.PIPOL_QAS,
      IndexName: "group-index",
      KeyConditionExpression: "#g = :g_id",
      ExpressionAttributeNames: {
        "#g": "group",
      },
      ExpressionAttributeValues: {
        ":g_id": userName,
      },
    };

    docClient.query(params, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        const { Items } = data;
        callback(
          Items?.filter(
            (item) =>
              item.latitud &&
              item.longitud &&
              item.tstamp >= Math.floor(Date.now() / 1000) - timeOffset * 60
          )
        );
      }
    });
  }
}

export function getClustersPoints({
  source,
  userName,
  timeOffset,
  callback,
}: ClusterPointsProps) {
  AWS.config.update(aws_remote_config);

  const docClient = new AWS.DynamoDB.DocumentClient();

  if (userName === "admin") {
    const params = {
      TableName:
        source === DataSource.PROD ? TABLES.CLUSTERS : TABLES.CLUSTERS_QAS,
      // FilterExpression: "tstamp >= :t",
      // ExpressionAttributeValues: {
      //   ":t": Math.floor(Date.now() / 1000) - timeOffset * 60,
      // },
    };
    docClient.scan(params, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        const { Items } = data;
        callback(Items);
      }
    });
  } else return [];
}

export function getEntitiesPlaces({
  source,
  entity,
  callback,
}: EntitiesPlacesProps) {
  if (entity === "POL") return [];
  AWS.config.update(aws_remote_config);

  const docClient = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: source === DataSource.PROD ? TABLES.ORGS : TABLES.ORGS_QAS,
    FilterExpression: "contains(org_id, :ent)",
    ExpressionAttributeValues: {
      ":ent": entity,
    },
  };

  docClient.scan(params, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      const { Items } = data;
      callback(Items);
    }
  });
}
