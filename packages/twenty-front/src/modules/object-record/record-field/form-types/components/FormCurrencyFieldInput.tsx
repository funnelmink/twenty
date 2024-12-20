import { useMemo } from 'react';
import { isDefined } from 'twenty-ui';
import { isString } from '@sniptt/guards';
import { CurrencyCode } from '@/object-record/record-field/types/CurrencyCode';
import { FieldCurrencyValue } from '@/object-record/record-field/types/FieldMetadata';
import { VariablePickerComponent } from '@/object-record/record-field/form-types/types/VariablePickerComponent';
import { FormFieldInputContainer } from '@/object-record/record-field/form-types/components/FormFieldInputContainer';
import { InputLabel } from '@/ui/input/components/InputLabel';
import { FormNestedFieldInputContainer } from '@/object-record/record-field/form-types/components/FormNestedFieldInputContainer';
import { FormNumberFieldInput } from '@/object-record/record-field/form-types/components/FormNumberFieldInput';
import { FormSelectFieldInput } from '@/object-record/record-field/form-types/components/FormSelectFieldInput';
import { SETTINGS_FIELD_CURRENCY_CODES } from '@/settings/data-model/constants/SettingsFieldCurrencyCodes';
import { convertCurrencyAmountToCurrencyMicros } from '~/utils/convertCurrencyToCurrencyMicros';

type FormCurrencyFieldInputProps = {
  label?: string;
  defaultValue?: FieldCurrencyValue | null;
  onPersist: (value: FieldCurrencyValue) => void;
  VariablePicker?: VariablePickerComponent;
};

export const FormCurrencyFieldInput = ({
  label,
  defaultValue,
  onPersist,
  VariablePicker,
}: FormCurrencyFieldInputProps) => {
  const currencies = useMemo(() => {
    return Object.entries(SETTINGS_FIELD_CURRENCY_CODES).map(
      ([key, { Icon, label }]) => ({
        value: key,
        icon: Icon,
        label: `${label} (${key})`,
      }),
    );
  }, []);

  const handleAmountMicrosChange = (newAmount: string | number | null) => {
    const formattedAmount = isString(newAmount)
      ? parseFloat(newAmount)
      : (newAmount ?? null);

    const formattedAmountMicros =
      !isDefined(formattedAmount) || isNaN(formattedAmount)
        ? null
        : convertCurrencyAmountToCurrencyMicros(formattedAmount);
    onPersist({
      currencyCode: (defaultValue?.currencyCode ?? '') as CurrencyCode,
      amountMicros: formattedAmountMicros,
    });
  };

  const handleCurrencyCodeChange = (newCurrencyCode: string | null) => {
    onPersist({
      currencyCode: (newCurrencyCode ?? '') as CurrencyCode,
      amountMicros: defaultValue?.amountMicros ?? null,
    });
  };

  return (
    <FormFieldInputContainer>
      {label ? <InputLabel>{label}</InputLabel> : null}
      <FormNestedFieldInputContainer>
        <FormSelectFieldInput
          label="Currency Code"
          defaultValue={defaultValue?.currencyCode ?? ''}
          onPersist={handleCurrencyCodeChange}
          options={currencies}
          clearLabel={label}
          VariablePicker={VariablePicker}
        />
        <FormNumberFieldInput
          label="Amount Micros"
          defaultValue={defaultValue?.amountMicros ?? ''}
          onPersist={handleAmountMicrosChange}
          VariablePicker={VariablePicker}
          placeholder="Amount Micros"
        />
      </FormNestedFieldInputContainer>
    </FormFieldInputContainer>
  );
};
