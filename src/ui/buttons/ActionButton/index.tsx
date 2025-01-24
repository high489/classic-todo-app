import styles from './action-button.module.scss'
import { FC, ReactNode } from 'react'

interface ActionButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  customStyle?: string;
}

const ActionButton: FC<ActionButtonProps> = ({
  children, onClick, disabled = false, customStyle
}) => {

  return (
    <>
      <button 
        className={`${styles['action-button']} ${customStyle}`}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    </>
  )
}

export { ActionButton }