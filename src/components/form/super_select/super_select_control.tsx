import React, {
  Fragment,
  FunctionComponent,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';
import classNames from 'classnames';

import { CommonProps } from '../../common';

import { EuiScreenReaderOnly } from '../../accessibility';
import { htmlIdGenerator } from '../../../services/accessibility';
import {
  EuiFormControlLayout,
  EuiFormControlLayoutProps,
} from '../form_control_layout';
import { EuiI18n } from '../../i18n';

export interface EuiSuperSelectOption<T> {
  value: T;
  inputDisplay?: ReactNode;
  dropdownDisplay?: ReactNode;
  disabled?: boolean;
  'data-test-subj'?: string;
}

export interface EuiSuperSelectControlProps<T>
  extends CommonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  compressed?: boolean;
  fullWidth?: boolean;
  isInvalid?: boolean;
  isLoading?: boolean;
  readOnly?: boolean;

  name?: string;
  value?: T;

  options?: Array<EuiSuperSelectOption<T>>;
}

export const EuiSuperSelectControl: <T extends string>(
  props: EuiSuperSelectControlProps<T>
) => ReturnType<FunctionComponent<EuiSuperSelectControlProps<T>>> = ({
  className,
  options = [],
  id,
  name,
  fullWidth = false,
  isLoading = false,
  isInvalid = false,
  defaultValue,
  compressed = false,
  value,
  ...rest
}) => {
  const classes = classNames(
    'euiSuperSelectControl',
    {
      'euiSuperSelectControl--fullWidth': fullWidth,
      'euiSuperSelectControl--compressed': compressed,
      'euiSuperSelectControl-isLoading': isLoading,
      'euiSuperSelectControl-isInvalid': isInvalid,
    },
    className
  );

  // React HTML input can not have both value and defaultValue properties.
  // https://reactjs.org/docs/uncontrolled-components.html#default-values
  let selectDefaultValue;
  if (value == null) {
    selectDefaultValue = defaultValue || '';
  }

  let selectedValue;
  if (value) {
    const selectedOption = options.find(option => option.value === value);
    selectedValue = selectedOption
      ? selectedOption.inputDisplay
      : selectedValue;
  }

  const icon: EuiFormControlLayoutProps['icon'] = {
    type: 'arrowDown',
    side: 'right',
  };

  const screenReaderId = htmlIdGenerator()();

  return (
    <Fragment>
      <input
        type="hidden"
        id={id}
        name={name}
        defaultValue={selectDefaultValue}
        value={value}
      />

      <EuiFormControlLayout
        icon={icon}
        fullWidth={fullWidth}
        isLoading={isLoading}
        compressed={compressed}>
        {/*
          This is read when the user tabs in. The comma is important,
          otherwise the screen reader often combines the text.
        */}
        <EuiScreenReaderOnly>
          <span id={screenReaderId}>
            <EuiI18n
              token="euiSuperSelectControl.selectAnOption"
              default="Select an option: {selectedValue}, is selected"
              values={{ selectedValue }}
            />
          </span>
        </EuiScreenReaderOnly>

        <button
          role="option"
          type="button"
          className={classes}
          aria-haspopup="true"
          aria-labelledby={`${id} ${screenReaderId}`}
          aria-selected={true}
          {...rest}>
          {selectedValue}
        </button>
      </EuiFormControlLayout>
    </Fragment>
  );
};
