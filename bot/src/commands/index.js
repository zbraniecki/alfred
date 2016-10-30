import { AddInboxItem } from './add-inbox-item';
import { RevertLastCommand } from './revert-last-command';
import { CreateReport } from './create-report';
import { AddGlossaryTerm } from './add-glossary-term';

const Commands = [
  RevertLastCommand,
  CreateReport,
  AddGlossaryTerm,
  AddInboxItem,
];

export default Commands;
