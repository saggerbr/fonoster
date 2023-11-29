/*
 * Copyright (C) 2023 by Fonoster Inc (https://fonoster.com)
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
import "../../config";
import { CLIError } from "@oclif/errors";
import { Command } from "@oclif/command";
import { CliUx } from "@oclif/core";
import { render } from "prettyjson";
import Projects from "@fonoster/projects";
import moment from "moment";

export default class GetCommand extends Command {
  static description = "get a Fonoster Project";
  static args = [{ name: "ref" }];

  async run() {
    const { args } = this.parse(GetCommand);

    try {
      const projects = new Projects();
      CliUx.ux.action.start(`Getting Project ${args.ref}`);
      const p = await projects.getProject(args.ref);

      const jsonObj = {
        Name: p.name,
        Ref: p.ref,
        "Access Key Id": p.accessKeyId,
        "Access Key Secret": p.accessKeySecret,
        "Allow Experiments": p.allowExperiments,
        Created: moment(p.createTime).fromNow(),
        Updated: moment(p.updateTime).fromNow()
      };

      await CliUx.ux.wait(1000);
      CliUx.ux.action.stop("");
      console.log(render(jsonObj, { noColor: true }));
    } catch (e) {
      throw new CLIError(e.message);
    }
  }
}
