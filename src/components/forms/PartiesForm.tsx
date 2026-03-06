'use client';

import { InputField, TextareaField, NestedInputField } from './FormFields';
import { useFormStore } from '../../store/formStore';

const PartiesForm = () => {
  const caseType = useFormStore(state => state.caseType);

  return (
    <section>
      <h3 className="font-serif text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
        B. Parties Involved
      </h3>
      <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>Details of complainant and respondent</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <InputField name="complainantName" label="Complainant / Plaintiff / Petitioner" placeholder="Enter full name" isRequired />
        <InputField name="complainantAge" label="Age / Occupation" placeholder="e.g., 32, Teacher" isRequired />
        <InputField name="respondentName" label="Defendant / Respondent / Accused" placeholder="Enter full name" isRequired />
        <InputField name="respondentAddress" label="Respondent's Address" placeholder="Enter address" />
      </div>
      <InputField name="complainantAddress" label="Complainant's Address" placeholder="Enter address" isRequired />

      {caseType === 'Family' && (
        <NestedInputField parent="familyDetails" name="relationshipInvolved" label="Relation Between Parties" placeholder="e.g., Husband-Wife" />
      )}

      <TextareaField name="respondentAddress" label="Co-Accused / Additional Parties" placeholder="Describe any other parties involved" />
    </section>
  );
};

export default PartiesForm;
