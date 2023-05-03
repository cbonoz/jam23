
import React from 'react'
import { convertCamelToCapitalSpaces } from '../util'

export default function Listify({ obj }) {
    if (!obj) {
        return null
    }
    return (
        <div>
            <ul>
                {Object.keys(obj).map((key, index) => (
                    <li key={index}>{convertCamelToCapitalSpaces(key)}: {JSON.stringify(obj[key]).replaceAll('"', "")}</li>
                ))}
            </ul>
        </div>
    )
}
