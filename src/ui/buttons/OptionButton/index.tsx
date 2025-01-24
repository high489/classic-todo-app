import styles from './option-button.module.scss'
import { FC, ReactNode } from 'react'

interface OptionButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
  customStyle?: string;
}

const OptionButton: FC<OptionButtonProps> = ({
  children, onClick, disabled = false, isActive = false, customStyle
}) => {
  return (
    <>
      <button
        className={`
          ${styles['option-button']}
          ${isActive ? styles['active'] : ''}
          ${customStyle}
        `}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    </>
  )
}

export { OptionButton }