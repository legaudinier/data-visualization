import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
            }}
        >
            <div
                onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                style={{
                    backgroundColor: '#fff',
                    padding: '24px',
                    borderRadius: '8px',
                    maxWidth: '90%',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3 style={{ textAlign: 'center' }}>
                        {title}
                    </h3>
                    <button onClick={onClose}
                        style={{
                            cursor: 'pointer',
                            background: 'none',
                            border: 'none',
                            fontSize: '26px',
                            left: '95%'
                        }}>
                        ✕
                    </button>
                </div>
                <div style={{
                    overflowX: 'scroll'
                }}>{children}</div>
            </div>
        </div>
    );
};