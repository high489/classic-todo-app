import styles from './custom-checkbox.module.scss'
import { FC } from 'react'

interface CustomCheckboxProps {
  checked: boolean;
  onChange: () => void;
}

const CustomCheckbox: FC<CustomCheckboxProps> = ({ checked, onChange}) => {
  return (
    <>
      <input
      type='checkbox'
      className={styles['custom-checkbox']}
      checked={checked}
      onChange={onChange}
    />
    </>
  )
}

export { CustomCheckbox }