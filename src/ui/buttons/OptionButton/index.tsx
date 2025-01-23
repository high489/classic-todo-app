import styles from './option-button.module.scss'
import { FC, ReactNode } from 'react'

interface OptionButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
}

const OptionButton: FC<OptionButtonProps> = ({
  children, onClick, disabled = false, isActive = false
}) => {
  return (
    <>
      <button
        className={`${styles['option-button']} ${isActive ? styles['active'] : ''}`}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    </>
  )
}

export { OptionButton }