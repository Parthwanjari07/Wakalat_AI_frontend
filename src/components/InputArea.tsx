'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUp, LoaderCircle, FileText, BotMessageSquare, ClipboardList } from 'lucide-react';
import { useFormStore } from '../store/formStore';
import { useChatStore } from '../store/chatStore';
import GuidedForm from './forms/GuidedForm';
import DocumentUploadForm, { FileData } from './forms/DocumentUploadForm';
import toast from 'react-hot-toast';

type InputView = 'text' | 'doc' | 'form';

function serializeFormData(f: ReturnType<typeof useFormStore.getState>): string {
  const lines: string[] = [`GUIDED FORM SUBMISSION — ${f.caseType?.toUpperCase()} CASE`];
  lines.push('');

  lines.push('== CASE METADATA ==');
  if (f.firNo) lines.push(`Case/FIR No.: ${f.firNo}`);
  if (f.jurisdiction) lines.push(`Jurisdiction: ${f.jurisdiction}`);
  if (f.dateOfIncident) lines.push(`Date of Incident: ${f.dateOfIncident}`);
  if (f.location) lines.push(`Place of Incident: ${f.location}`);

  lines.push('');
  lines.push('== PARTIES INVOLVED ==');
  lines.push(`Complainant/Petitioner: ${f.complainantName}`);
  if (f.complainantAge) lines.push(`Age/Occupation: ${f.complainantAge}`);
  if (f.complainantAddress) lines.push(`Complainant Address: ${f.complainantAddress}`);
  lines.push(`Respondent/Accused: ${f.respondentName}`);
  if (f.respondentAddress) lines.push(`Respondent Address: ${f.respondentAddress}`);

  lines.push('');
  lines.push('== CASE DETAILS ==');

  if (f.caseType === 'Criminal') {
    const d = f.criminalDetails;
    if (d.natureOfOffence) lines.push(`Nature of Offence: ${d.natureOfOffence}`);
    if (d.sections?.length) lines.push(`Sections Applicable: ${Array.isArray(d.sections) ? d.sections.join(', ') : d.sections}`);
    if (d.briefDescription) lines.push(`Brief Description: ${d.briefDescription}`);
  } else if (f.caseType === 'Civil') {
    const d = f.civilDetails;
    if (d.typeOfDispute) lines.push(`Type of Dispute: ${d.typeOfDispute}`);
    if (d.reliefSought) lines.push(`Relief Sought: ${d.reliefSought}`);
    if (d.claimAmount) lines.push(`Claim Value: ${d.claimAmount}`);
    if (d.groundsOfDispute) lines.push(`Grounds of Dispute: ${d.groundsOfDispute}`);
  } else if (f.caseType === 'Cybercrime') {
    const d = f.cybercrimeDetails;
    if (d.natureOfCyberOffence) lines.push(`Nature of Cyber Offence: ${d.natureOfCyberOffence}`);
    if (d.platformInvolved) lines.push(`Affected Platforms: ${d.platformInvolved}`);
    if (d.modeOfOperation) lines.push(`Mode of Operation: ${d.modeOfOperation}`);
    if (d.lossDetails) lines.push(`Monetary/Data Loss: ${d.lossDetails}`);
    if (d.technicalDetails) lines.push(`Technical Details: ${d.technicalDetails}`);
  } else if (f.caseType === 'Family') {
    const d = f.familyDetails;
    if (d.typeOfFamilyMatter) lines.push(`Type of Family Matter: ${d.typeOfFamilyMatter}`);
    if (d.groundsForPetition) lines.push(`Grounds for Petition: ${d.groundsForPetition}`);
    if (d.marriageDetails) lines.push(`Marriage Details: ${d.marriageDetails}`);
    if (d.childrenInfo) lines.push(`Children/Dependents: ${d.childrenInfo}`);
    if (d.relationshipInvolved) lines.push(`Relation Between Parties: ${d.relationshipInvolved}`);
    if (d.mainIssues) lines.push(`Main Issues: ${d.mainIssues}`);
  }

  lines.push('');
  lines.push('Please conduct a comprehensive legal analysis of this case using all relevant tools.');

  return lines.join('\n');
}

const InputArea = () => {
  const [activeView, setActiveView] = useState<InputView>('text');
  const [isLoading, setIsLoading] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]);

  const router = useRouter();
  const createChat = useChatStore((state) => state.createChat);
  const sendMessageWithGemini = useChatStore((state) => state.sendMessageWithGemini);
  const formState = useFormStore();

  const handleSubmit = async () => {
    setIsLoading(true);
    let userInput = '';
    let chatTitle = '';

    if (activeView === 'text') {
      if (!textInput.trim()) {
        toast.error("Please enter some text to analyze.");
        setIsLoading(false);
        return;
      }
      userInput = textInput;
      chatTitle = textInput.split(' ').slice(0, 5).join(' ') + (textInput.split(' ').length > 5 ? '...' : '');
    } else if (activeView === 'form') {
      if (!formState.caseType) {
        toast.error("Please select a Case Type before submitting.");
        setIsLoading(false);
        return;
      }
      if (!formState.complainantName || !formState.respondentName) {
        toast.error("Please fill in the Complainant and Respondent names.");
        setIsLoading(false);
        return;
      }
      userInput = serializeFormData(formState);
      chatTitle = `${formState.caseType} Case`;
    } else {
      if (uploadedFiles.length === 0) {
        toast.error("Please upload at least one document.");
        setIsLoading(false);
        return;
      }
      const docNames = uploadedFiles.map(d => d.name).join(', ');
      userInput = `Please analyze the following uploaded legal document(s): ${docNames}. Provide a comprehensive legal analysis including summary, key provisions, parties involved, potential issues, compliance with Indian legal standards, and recommendations.`;
      chatTitle = uploadedFiles.length === 1
        ? `Document: ${uploadedFiles[0].name}`
        : `Documents: ${uploadedFiles.length} files`;
    }

    try {
      const newChatId = createChat(userInput, chatTitle);
      router.push(`/chat/${newChatId}`);

      const attachments = activeView === 'doc' ? uploadedFiles.map(f => ({
        name: f.name,
        mimeType: f.type,
        base64Data: f.base64Content,
      })) : undefined;
      await sendMessageWithGemini(newChatId, userInput, true, true, attachments);
      setTextInput('');
    } catch (error) {
      console.error('Error submitting case:', error);
      toast.error('Failed to submit case. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs: { view: InputView; icon: typeof BotMessageSquare; label: string; badge?: string }[] = [
    { view: 'text', icon: BotMessageSquare, label: 'Text Input' },
    { view: 'doc', icon: FileText, label: 'Document' },
    { view: 'form', icon: ClipboardList, label: 'Guided Form', badge: 'Recommended' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto py-4 px-4 mb-16">
      {/* Tab Switcher */}
      <div className="flex items-center justify-center gap-1.5 mb-6 p-1 rounded-xl mx-auto w-fit" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
        {tabs.map(({ view, icon: Icon, label, badge }) => {
          const isActive = activeView === view;
          return (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
              style={{
                background: isActive ? 'var(--accent)' : 'transparent',
                color: isActive ? '#0C0B09' : 'var(--text-secondary)',
              }}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{label}</span>
              {badge && (
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full hidden sm:inline"
                  style={{
                    background: isActive ? 'rgba(0,0,0,0.15)' : 'var(--accent-subtle)',
                    color: isActive ? '#0C0B09' : 'var(--accent)',
                  }}
                >
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="relative">
        {activeView === 'text' && (
          <div>
            <div className="relative card-chamber overflow-hidden">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full h-48 p-5 pr-16 text-[15px] leading-relaxed resize-none focus:outline-none"
                style={{
                  background: 'var(--bg-elevated)',
                  color: 'var(--text-primary)',
                }}
                placeholder="Paste the full case description, FIR details, or legal query here..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    handleSubmit();
                  }
                }}
              />
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="absolute bottom-5 right-5 flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed btn-brass"
              >
                {isLoading ? <LoaderCircle size={18} className="animate-spin" /> : <ArrowUp size={18} />}
              </button>
            </div>
            <p className="text-center mt-4 text-xs" style={{ color: 'var(--text-tertiary)' }}>
              WAKALAT.AI can make mistakes. Verify important legal information.
            </p>
          </div>
        )}

        {activeView === 'doc' && (
          <div className="flex flex-col items-center justify-center gap-4">
            <DocumentUploadForm onFilesChange={setUploadedFiles} />
          </div>
        )}

        {activeView === 'form' && <GuidedForm />}
      </div>

      {/* Submit Button for doc/form views */}
      {(activeView === 'doc' || activeView === 'form') && (
        <div className="flex flex-col items-center mt-6">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center justify-center gap-2.5 px-7 py-3 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed btn-brass"
          >
            {isLoading ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : (
              <>
                <ArrowUp size={18} />
                Submit for Analysis
              </>
            )}
          </button>
          <p className="text-center mt-4 text-xs" style={{ color: 'var(--text-tertiary)' }}>
            WAKALAT.AI can make mistakes. Verify important legal information.
          </p>
        </div>
      )}
    </div>
  );
};

export default InputArea;
