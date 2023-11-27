import React, { useEffect, useState } from 'react'
import styles from './AutoFillBox.module.css'
import AutoFillBoxItem from './AutoFillBoxItem'

function AutoFillBox({
    className,
    selectedOptionClassName,
    optionsList,
    onSelectionUpdate,
    customValueValidator,
    selectorKeys = ["Enter", "Tab"],
    width = "auto"
}) {
    const [options, setOptions] = useState(optionsList ? optionsList : [])
    const [currentValue, setCurrentValue] = useState("")
    const [selectedOptions, setSelectedOptions] = useState([])

    const defaultValidator = (value) => {
        if (customValueValidator != undefined) {
            return customValueValidator(value);
        }
        return true;
    }

    useEffect(() => {
        setOptions(Array.from(new Set([...optionsList, ...selectedOptions])))
        if(onSelectionUpdate != undefined){
            onSelectionUpdate(selectedOptions)
        }
    }, [selectedOptions])

    return ( <div className={className != undefined ? `${styles.autoCompleteBox} ${className}` : styles.autoCompleteBox} style={{
            'width': width
        }}>
            <div className={styles.selectedItems}>
                {
                    selectedOptions.map((value, ind) => {
                        return (
                            <AutoFillBoxItem key={value.toString()} className={selectedOptionClassName} value={value} valueIndex={ind} removeItem={() => {
                                setSelectedOptions(selectedOptions => {
                                    return selectedOptions.filter((value, i) => i !== ind)
                                })
                            }
                            } />
                        )
                    })
                }

                <div contentEditable className={styles.inputField}
                    onKeyDown={(e) => {
                        if ((selectorKeys).includes(e.code)) {
                            e.preventDefault();
                            const filteredOptions = options.filter((value) => {
                                return value.toLowerCase().includes(currentValue.toLowerCase())
                            });
                            if (currentValue.trim().length > 0) {
                                if (filteredOptions.length > 0) {
                                    const selectedValue = filteredOptions[0];
                                    if (selectedOptions.includes(selectedValue)) {
                                        return;
                                    }
                                    setSelectedOptions(
                                        [...selectedOptions,
                                            selectedValue
                                        ]
                                    )
                                }
                                else {
                                    const selectedValue = e.target.innerText.trim();
                                    if (!defaultValidator(selectedValue)) {
                                        return;
                                    }
                                    setSelectedOptions(
                                        [...selectedOptions, selectedValue]
                                    )
                                }
                            }
                            e.target.innerHTML = ""
                            setCurrentValue("")
                        }
                        else if (e.code == "Backspace") {
                            if (e.target.innerText.trim() == "") {
                                setSelectedOptions(selectedOptions.splice(0, selectedOptions.length - 1))
                            }
                        }
                    }}
                    onInput={(e) => {
                        setCurrentValue(e.target.innerText.trim())
                    }}
                ></div>
            </div>
            {
                currentValue != "" &&
                <div className={styles.optionsSuggestionList}>
                    {options
                        .filter((value) => {
                            return value.toLowerCase().includes(currentValue.toLowerCase())
                        })
                        .map((value) => {
                            return (
                                <button key={value.toString()} tabIndex={-1} className={styles.optionsListItem}
                                    onClick={(e) => {
                                        setSelectedOptions(
                                            [...selectedOptions, value]
                                        )
                                    }}
                                    disabled={
                                        selectedOptions.includes(value)
                                    }
                                >
                                    {
                                        value.toString()
                                    }
                                </button>
                            )
                        })}
                </div>
            }
        </div>
    )
}

export default AutoFillBox