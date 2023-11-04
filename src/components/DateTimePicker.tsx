import React from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

// @ts-ignore
const DateTimePicker = ({selectedDate, onChange}) => {
    const isMobile = window.innerWidth <= 768

    return (
        <DatePicker
            wrapperClassName="w-[35%]"
            selected={selectedDate}
            onChange={onChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="MMMM d, yyyy h:mm aa"
            popperPlacement={isMobile ? 'bottom' : 'auto'}
            popperModifiers={{
                // @ts-ignore
                preventOverflow: {
                    enabled: true,
                },
            }}
            className={`w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-blue-200 ${
                isMobile ? 'text-sm' : 'text-base'
            }`}
        />
    )
}

export default DateTimePicker
