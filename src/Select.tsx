import React, { useEffect, useRef, useState } from 'react'
import styles from './Select.module.css'



type SelectOption = {
  label: string;
  value: string;
}

type MultipleSelectProps = {
  multiple: true;
  value: SelectOption[];
  onChange: (value: SelectOption[]) => void
}

type SingleSelectProps = {
  multiple: false;
  value?: SelectOption
  onChange: (value: SelectOption | undefined) => void
}

type SelectProps = {
  options: SelectOption[];
} & (SingleSelectProps | MultipleSelectProps)

const Select = ({ value, onChange, options, multiple }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)


  const clearHandle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    multiple ? onChange([]) : onChange(undefined)
  }

  const pickOptionHandle = (e: React.MouseEvent<HTMLLIElement | HTMLButtonElement, MouseEvent> | undefined, option: SelectOption) => {
    e?.stopPropagation()
    if (multiple) {
      if (value.includes(option)) {
        onChange(value.filter((o) => o.value !== option.value))
      } else {
        onChange([...value, option])
      }
    } else {
      if (option.value !== value?.value) onChange(option)
    }
    setIsOpen(false)
  }

  const isOptionSelected = (option: SelectOption) => {
    return multiple ? value.includes(option) : option.value === value?.value
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target != containerRef.current) return
      switch (e.code) {
        case "Enter":
        case "Space":
          setIsOpen(prev => !prev)
          if (isOpen) pickOptionHandle(undefined, options[highlightedIndex])
          break;
        case "ArrowUp":
        case "ArrowDown": {
          if (!isOpen) {
            setIsOpen(true)
            break;
          }

          const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1)
          if (newValue >= 0 && newValue < options.length) {
            setHighlightedIndex(newValue)
          }
          break;
        }
        case "Escape":
          setIsOpen(false)
          break;

      }
    }
    containerRef.current?.addEventListener("keydown", handler)
    return () => {
      containerRef.current?.removeEventListener("keydown", handler)
    }
  }, [highlightedIndex, isOpen, options])
  return (
    <div
      tabIndex={0}
      className={styles.container}
      onClick={() => setIsOpen(prev => !prev)}
      onBlur={() => setIsOpen(false)}
      ref={containerRef}
    >
      <span className={styles.value}>{multiple ? value.map(val => (
        <button
          className={styles["option-badge"]}
          key={val.value}
          onClick={e => {
            e.stopPropagation()
            pickOptionHandle(e, val)
          }}>{val.label}
          <span className={styles["clear-btn"]}>&times;</span>
        </button>
      )) : value?.label}</span>
      <button className={styles["clear-btn"]} onClick={clearHandle}>&times;</button>
      <div className={styles.divider}></div>
      <div className={styles.caret}></div>
      <ul className={`${styles.options} ${isOpen && styles.show}`}>
        {options.map((option, index) => (
          <li
            key={option.value}
            onMouseEnter={() => setHighlightedIndex(index)}
            className={`${styles.option} ${isOptionSelected(option) ? styles.selected : ""
              } ${index === highlightedIndex ? styles.highlighted : ""}`}
            onClick={(e) => pickOptionHandle(e, option)}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>

  )
}

export default Select