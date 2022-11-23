import { useState } from 'react';
import Select from './Select'

const options = [
  { label: 'something1', value: '1' },
  { label: 'something2', value: '2' },
  { label: 'something3', value: '3' },
  { label: 'something4', value: '4' },
]


type SelectOption = {
  label: string;
  value: string;
}

function App() {
  const [value, setValue] = useState<SelectOption | undefined>(options[0])
  const [value2, setValue2] = useState<SelectOption[]>([options[0]])
  return (
    <div>
      <Select
        multiple={false}
        options={options}
        onChange={(value: SelectOption | undefined) => setValue(value)}
        value={value}
      />
      <br />
      <Select
        multiple={true}
        options={options}
        onChange={(o: SelectOption[]) => setValue2(o)}
        value={value2}
      />
    </div>
  )
}

export default App
