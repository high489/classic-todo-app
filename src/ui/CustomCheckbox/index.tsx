import styles from './custom-checkbox.module.scss'
import { FC } from 'react'

import ActiveIcon from '@assets/icons/active-icon.svg?react'
import CompletedIcon from '@assets/icons/completed-icon.svg?react'

interface CustomCheckboxProps {
  id?: string
  value?: string
  name?: string
  checked?: boolean
  disabled?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  customStyle?: string;
}

const CustomCheckbox: FC<CustomCheckboxProps> = ({
  id, value, name, checked, disabled, onChange, customStyle
}) => {
  return (
    <>
      <label className={`${styles['checkbox']} ${customStyle}`}>
        <input
          type='checkbox'
          id={id}
          value={value}
          name={name}
          checked={checked}
          disabled={disabled}
          onChange={onChange}
        />
        {checked ? (<CompletedIcon />) : (<ActiveIcon />)}
      </label>
    </>
  )
}

export { CustomCheckbox }