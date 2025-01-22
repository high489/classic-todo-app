import styles from './custom-input.module.scss'
import { FC } from 'react'

interface CustomInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const CustomInput: FC<CustomInputProps> = ({
  value, onChange, placeholder
}) => {
  return (
    <>
      <input
        className={styles['custom-input']}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </>
  )
}

export { CustomInput }