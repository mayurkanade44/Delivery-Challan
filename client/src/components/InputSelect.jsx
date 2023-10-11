import Select from "react-select";

const InputSelect = ({
  onChange,
  options,
  value,
  placeholder,
  label,
  isMulti = false,
}) => {
  return (
    <div className="mt-2">
      <label className="block text-md font-medium leading-6 text-gray-900">
        {label}
        <span className="text-red-500 required-dot ml-0.5">*</span>
      </label>
      <Select
        defaultValue={value}
        placeholder={placeholder}
        isMulti={isMulti}
        className="basic-multi-select"
        isClearable
        options={options}
        menuPlacement="auto"
        value={options?.find((c) => c.value === value?.value)}
        onChange={(val) => onChange(val)}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            minHeight: "31px",
            height: "32px",
            boxShadow: state.isFocused ? null : null,
            marginTop: "2px",
            borderColor: "#CCCCCC",
            borderWidth: "2px",
            paddingTop: "0px",
          }),

          valueContainer: (provided, state) => ({
            ...provided,
            height: "30px",
            padding: "0 5px",
          }),

          input: (provided, state) => ({
            ...provided,
            margin: "0px",
          }),

          indicatorsContainer: (provided, state) => ({
            ...provided,
            height: "31px",
          }),
        }}
      />
    </div>
  );
};
export default InputSelect;
