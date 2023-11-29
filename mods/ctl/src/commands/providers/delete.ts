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
import { CLIError } from "@oclif/errors";
import { getProjectConfig, hasProjectConfig } from "../../config";
import Command from "../../base/delete";
import Providers from "@fonoster/providers";

export default class DeleteCommand extends Command {
  static description = "delete a Fonoster Provider";
  static args = [{ name: "ref" }];
  static aliases = ["providers:del", "providers:rm"];

  async run() {
    if (!hasProjectConfig()) {
      throw new CLIError("you must set a default project");
    }
    try {
      await super.deleteResource(
        new Providers(getProjectConfig()),
        "deleteProvider"
      );
    } catch (e) {
      if (e.code === 9) {
        throw new CLIError(
          "unable to delete: first ensure there are no Numbers under this Fonoster Provider"
        );
      } else {
        throw new CLIError(e.message);
      }
    }
  }
}
