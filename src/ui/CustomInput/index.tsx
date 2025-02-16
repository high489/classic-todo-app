import styles from './custom-input.module.scss'
import { FC } from 'react'

interface CustomInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  customStyle?: string;
}

const CustomInput: FC<CustomInputProps> = ({
  value, onChange, onKeyDown, placeholder, customStyle
}) => {
  return (
    <>
      <input
        className={`${styles['custom-input']} ${customStyle}`}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
      />
    </>
  )
}

export { CustomInput }