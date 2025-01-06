/*
 * Copyright (C) 2025 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * This file is part of Fonoster
 *
 * Licensed under the MIT License (the "License");
 * you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *    https://opensource.org/licenses/MIT
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { getLogger } from "@fonoster/logger";
import { flux } from "@influxdata/influxdb-client";
import { CallDetailRecord } from "@fonoster/types";
import {
  CALL_DETAIL_RECORD_MEASUREMENT,
  INFLUXDB_CALLS_BUCKET,
  InfluxDBClient
} from "@fonoster/common";

const logger = getLogger({ service: "apiserver", filePath: __filename });

function createFetchSingleCall(influxdb: InfluxDBClient) {
  return async (
    accessKeyId: string,
    ref: string
  ): Promise<CallDetailRecord> => {
    const query = flux`from(bucket: "${INFLUXDB_CALLS_BUCKET}")
      |> range(start: -365d)
      |> pivot(rowKey: ["callId"], columnKey: ["_field"], valueColumn: "_value")
      |> map(fn: (r) => ({
          r with
          duration: int(v: r.endedAt) - int(v: r.startedAt)
        }))
      |> filter(fn: (r) => r._measurement == "${CALL_DETAIL_RECORD_MEASUREMENT}")
      |> filter(fn: (r) => r.ref == ${ref} and r.accessKeyId == "${accessKeyId}")
      |> sort(columns: ["_time"], desc: true)
      |> limit(n: 1)`;

    logger.verbose("fetch single call request", { accessKeyId, ref });

    const items = (await influxdb.collectRows(query)) as CallDetailRecord[];

    return items.length > 0 ? items[0] : null;
  };
}

export { createFetchSingleCall };
