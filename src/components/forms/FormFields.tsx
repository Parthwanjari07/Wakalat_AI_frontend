'use client';

import { useFormStore, FormState } from '../../store/formStore';

type NestedFields = 'criminalDetails' | 'civilDetails' | 'cybercrimeDetails' | 'familyDetails';

interface FieldProps {
  name: keyof Omit<FormState, 'updateField' | 'updateNestedField' | 'criminalDetails' | 'civilDetails' | 'cybercrimeDetails' | 'familyDetails'>;
  label: string;
  placeholder?: string;
  isRequired?: boolean;
}

interface NestedFieldProps<P extends NestedFields> {
  parent: P;
  name: keyof FormState[P];
  label: string;
  placeholder?: string;
  isRequired?: boolean;
}

export const InputField = ({ name, label, placeholder, isRequired = false }: FieldProps) => {
  const value = useFormStore(state => state[name]);
  const updateField = useFormStore(state => state.updateField);

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
        {label} {isRequired && <span style={{ color: 'var(--accent)' }}>*</span>}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        value={value as string || ''}
        onChange={(e) => updateField(name, e.target.value)}
        placeholder={placeholder || ''}
        className="w-full p-2.5 rounded-lg text-sm input-chamber"
      />
    </div>
  );
};

export const TextareaField = ({ name, label, placeholder, isRequired = false }: FieldProps) => {
  const value = useFormStore(state => state[name]);
  const updateField = useFormStore(state => state.updateField);

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
        {label} {isRequired && <span style={{ color: 'var(--accent)' }}>*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value as string || ''}
        onChange={(e) => updateField(name, e.target.value)}
        placeholder={placeholder || ''}
        rows={3}
        className="w-full p-2.5 rounded-lg text-sm resize-y input-chamber"
      />
    </div>
  );
};

interface SelectFieldProps extends FieldProps {
  options: { value: string; label: string }[];
}

export const SelectField = ({ name, label, options, isRequired = false }: SelectFieldProps) => {
  const value = useFormStore(state => state[name]);
  const updateField = useFormStore(state => state.updateField);

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
        {label} {isRequired && <span style={{ color: 'var(--accent)' }}>*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value as string || ''}
        onChange={(e) => updateField(name, e.target.value)}
        className="w-full p-2.5 rounded-lg text-sm input-chamber"
      >
        <option value="" disabled>-- Select an option --</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export const NestedInputField = <P extends NestedFields>({ parent, name, label, placeholder, isRequired = false }: NestedFieldProps<P>) => {
  const value = useFormStore(state => state[parent][name]);
  const updateNestedField = useFormStore(state => state.updateNestedField);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNestedField(parent, name, e.target.value as FormState[P][keyof FormState[P]]);
  };

  return (
    <div className="mb-4">
      <label htmlFor={`${parent}.${String(name)}`} className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
        {label} {isRequired && <span style={{ color: 'var(--accent)' }}>*</span>}
      </label>
      <input
        id={`${parent}.${String(name)}`}
        name={`${parent}.${String(name)}`}
        type="text"
        value={typeof value === 'string' ? value : Array.isArray(value) ? value.join(', ') : ''}
        onChange={handleChange}
        placeholder={placeholder || ''}
        className="w-full p-2.5 rounded-lg text-sm input-chamber"
      />
    </div>
  );
};

export const NestedTextareaField = <P extends NestedFields>({ parent, name, label, placeholder, isRequired = false }: NestedFieldProps<P>) => {
  const value = useFormStore(state => state[parent][name]);
  const updateNestedField = useFormStore(state => state.updateNestedField);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNestedField(parent, name, e.target.value as FormState[P][keyof FormState[P]]);
  };

  return (
    <div className="mb-4">
      <label htmlFor={`${parent}.${String(name)}`} className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
        {label} {isRequired && <span style={{ color: 'var(--accent)' }}>*</span>}
      </label>
      <textarea
        id={`${parent}.${String(name)}`}
        name={`${parent}.${String(name)}`}
        value={typeof value === 'string' ? value : ''}
        onChange={handleChange}
        placeholder={placeholder || ''}
        rows={4}
        className="w-full p-2.5 rounded-lg text-sm resize-y input-chamber"
      />
    </div>
  );
};
