import { useState } from 'react'
import './App.css'

// Turn an age (already converted to total months) into a group + message
function classify(totalMonths, enteredZeroYears) {
  const years = Math.floor(totalMonths / 12)

  if (enteredZeroYears) {
    return {
      group: 'Infant',
      minor: true,
      tone: 'baby',
      message:
        'You entered 0, which means under 1 year old. Switch to "Months" to get the exact stage (newborn or infant).',
    }
  }
  if (totalMonths < 1)
    return { group: 'Newborn', minor: true, tone: 'baby', message: 'Less than 1 month old.' }
  if (totalMonths < 12)
    return { group: 'Infant', minor: true, tone: 'baby', message: 'Under 1 year old.' }
  if (years <= 2)
    return { group: 'Toddler', minor: true, tone: 'kid', message: '1 to 2 years old.' }
  if (years <= 5)
    return { group: 'Preschooler', minor: true, tone: 'kid', message: '3 to 5 years old.' }
  if (years <= 12)
    return { group: 'Child', minor: true, tone: 'kid', message: '6 to 12 years old.' }
  if (years <= 17)
    return { group: 'Teenager', minor: true, tone: 'teen', message: '13 to 17 years old.' }
  if (years <= 59)
    return { group: 'Adult', minor: false, tone: 'adult', message: '18 to 59 years old.' }
  return { group: 'Senior', minor: false, tone: 'senior', message: '60 years old and above.' }
}

function formatMonths(totalMonths) {
  const y = Math.floor(totalMonths / 12)
  const m = totalMonths % 12
  const parts = []
  if (y) parts.push(`${y} ${y === 1 ? 'year' : 'years'}`)
  if (m || !y) parts.push(`${m} ${m === 1 ? 'month' : 'months'}`)
  return parts.join(' and ')
}

export default function App() {
  const [value, setValue] = useState('')
  const [unit, setUnit] = useState('years') // 'years' | 'months'

  const trimmed = value.trim()
  const num = Number(trimmed)

  let error = ''
  let result = null

  if (trimmed !== '') {
    if (Number.isNaN(num)) error = 'Please enter a number.'
    else if (num < 0) error = 'Age cannot be negative.'
    else if (!Number.isInteger(num)) error = 'Please enter a whole number.'
    else if (unit === 'years' && num > 120) error = 'Please enter an age of 120 or below.'
    else if (unit === 'months' && num > 1440) error = 'Please enter 1440 months (120 years) or below.'
    else {
      const totalMonths = unit === 'years' ? num * 12 : num
      result = {
        ...classify(totalMonths, unit === 'years' && num === 0),
        totalMonths,
      }
    }
  }

  return (
    <main className="page">
      <section className="card">
        <h1>Age detector</h1>
        <p className="sub">Enter an age to see the age group and how many months it is.</p>

        <div className="unit-toggle" role="group" aria-label="Age unit">
          {['years', 'months'].map((u) => (
            <button
              key={u}
              type="button"
              className={unit === u ? 'active' : ''}
              onClick={() => setUnit(u)}
            >
              {u === 'years' ? 'Years' : 'Months'}
            </button>
          ))}
        </div>

        <label className="field">
          <span>Age in {unit}</span>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            value={value}
            placeholder={unit === 'years' ? 'e.g. 15' : 'e.g. 8'}
            onChange={(e) => setValue(e.target.value)}
          />
        </label>

        {error && <p className="error" role="alert">{error}</p>}

        {result && (
          <div className={`result ${result.tone}`} aria-live="polite">
            <div className="group">{result.group}</div>
            <div className={`badge ${result.minor ? 'minor' : 'not-minor'}`}>
              {result.minor ? 'Minor' : 'Not a minor'}
            </div>
            <p className="msg">{result.message}</p>
            <dl>
              <div>
                <dt>In months</dt>
                <dd>{result.totalMonths.toLocaleString()}</dd>
              </div>
              <div>
                <dt>Exact age</dt>
                <dd>{formatMonths(result.totalMonths)}</dd>
              </div>
            </dl>
            {unit === 'years' && num === 0 && (
              <button type="button" className="link" onClick={() => { setUnit('months'); setValue('') }}>
                Enter age in months instead
              </button>
            )}
          </div>
        )}
      </section>
    </main>
  )
}