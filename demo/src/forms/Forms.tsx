import './forms.scss'
import { formsLogic, Provider } from './formsLogic'
import { useActions, useValues } from 'kea'
import { Form, Field, Group } from 'kea-forms'

interface InputProps extends Omit<React.HTMLProps<HTMLInputElement>, 'onChange'> {
  onChange?: (value: string) => void
  value?: string
}

function Input({ onChange, value, ...props }: InputProps): JSX.Element {
  return <input {...props} value={value || ''} onChange={(e) => onChange?.(e.target.value)} />
}

export function Forms() {
  const { isUserFormSubmitting, userForm } = useValues(formsLogic)
  const { setUserFormValue, setUserFormValues, removeAccount, submitUserForm } = useActions(formsLogic)

  return (
    <div>
      <p>Demonstrating a simple form below</p>
      <Form logic={formsLogic} form="userForm">
        <Field name="name" label="Name">
          <input className="form-input" />
        </Field>
        <Field name="email" label="Email">
          <Input className="form-input" />
        </Field>
        <Field name="guest" label="Guest name">
          <select>
            <option value="" />
            <option value="My Name">My Name</option>
            <option value="Other Name">Other Name</option>
            <option value="Lolz">Lolz</option>
          </select>
        </Field>

        <button onClick={() => setUserFormValue('guest', '')}>No Guest</button>
        <button onClick={() => setUserFormValue('guest', 'Other Name')}>Other Guest</button>

        <h2>Accounts via &lt;Group /&gt;</h2>

        {userForm.accounts.map((account, index) => (
          <Group key={index} name={['accounts', index]}>
            <h3>Account #{index + 1} <button onClick={() => removeAccount(index)}>Remove</button></h3>

            <Field
              name='provider'
              label="Provider"
              hint={account.provider === Provider.Facebook ? 'Are you sure you trust this one?' : null}
            >
              <select>
                <option value="" />
                <option value={Provider.Facebook}>Facebook</option>
                <option value={Provider.Google}>Google</option>
                <option value={Provider.Twitter}>Twitter</option>
              </select>
            </Field>
            <Field name='url' label="Url">
              <Input className="form-input" />
            </Field>
          </Group>
        ))}

        <button onClick={() => setUserFormValues({ accounts: [...userForm.accounts, {}] })}>Add Account</button>

        <Field name="subscribe">
          {({ onChange, value }) => (
            <label>
              <input type="checkbox" onChange={(e) => onChange(e.target.checked)} value={value} /> Subscribe to our
              newsletter!!
            </label>
          )}
        </Field>

        <div>
          <button onClick={submitUserForm} className="form-submit">
            {isUserFormSubmitting ? '... ' : 'Submit Form!'}
          </button>
        </div>
      </Form>
    </div>
  )
}
