export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'skipped' | 'current';
export interface ApprovalStep {
    id: string;
    name: string;
    role?: string;
    status: ApprovalStatus;
    timestamp?: string;
    comment?: string;
}
export interface ApprovalChainOptions {
    onAction?: (step: ApprovalStep, action: 'approve' | 'reject' | 'skip') => void;
    editable?: boolean;
    orientation?: 'horizontal' | 'vertical';
}
export interface ApprovalChainController {
    update: (steps: ApprovalStep[]) => void;
    setStatus: (id: string, status: ApprovalStatus, timestamp?: string) => void;
    destroy: () => void;
}
/**
 * Create an approval chain visualization inside a container element.
 * Renders step nodes with avatars, status badges, and connectors.
 */
export declare function approvalChain(el: HTMLElement, steps: ApprovalStep[], opts?: ApprovalChainOptions): ApprovalChainController;
