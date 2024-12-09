/*
 * Copyright (C) 2024 by Fonoster Inc (https://fonoster.com)
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
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { GenericToggle } from "./GenericToggle";

/**
 * This story is for the Generic Toggle component based on MUI switch component
 * It takes a defaultvalue, value, disable and onChange.
 */
const meta = {
  title: "Shared Components/GenericToggle",
  component: GenericToggle,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/OsZlne0RvIgoFlFKF7hnAU/Shared-Component-Library?t=VurPhwDRshOL2dRM-0"
    }
  },
  tags: ["autodocs"],
  args: { onChange: fn() },
  argTypes: {
    onChange: {
      name: "On Change",
      description: "Function to execute on change"
    },
    defaultValue: {
      name: "Default Value",
      control: "boolean",
      description: "The default value to use"
    },
    value: {
      name: "Value",
      control: "boolean",
      description: "The current value"
    },
    disabled: {
      name: "Disabled",
      description: "If true, the toggle will be disabled",
      control: "boolean"
    }
  }
} satisfies Meta<typeof GenericToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Example of a GenericToggle with default value false.
 */
export const DefaultValueFalse: Story = {
  args: {
    defaultValue: false,
    onChange: fn()
  }
};

/**
 * Example of a GenericToggle with default value true.
 */
export const DefaultValueTrue: Story = {
  args: {
    defaultValue: true,
    onChange: fn()
  }
};

/**
 * Example of a checked GenericToggle.
 */
export const Checked: Story = {
  args: {
    value: true,
    onChange: fn()
  }
};

/**
 * Example of a unchecked GenericToggle.
 */
export const Unchecked: Story = {
  args: {
    value: false,
    onChange: fn()
  }
};

/**
 * Example of a unchecked and disabled GenericToggle.
 */
export const UncheckedAndDisabled: Story = {
  args: {
    disabled: true,
    value: false,
    onChange: fn()
  }
};

/**
 * Example of a checked and disabled GenericToggle.
 */
export const CheckedAndDisabled: Story = {
  args: {
    disabled: true,
    value: true,
    onChange: fn()
  }
};
