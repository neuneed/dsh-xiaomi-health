import React from 'react'
import type { Translate } from '../locales.ts'

interface Props {
  isOpen: boolean
  qrBase64?: string
  qrUrl?: string
  loginUrl?: string
  onClose: () => void
  t: Translate
}

export const LoginModal: React.FC<Props> = ({
  isOpen,
  qrBase64,
  loginUrl,
  onClose,
  t,
}) => {
  if (!isOpen) return null

  return (
    <div className="dsh-health-modal-overlay" onClick={onClose}>
      <div className="dsh-health-modal" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#f8fafc' }}>
          {t('loginModal.title')}
        </h3>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 8px 0', textAlign: 'left' }}>
          {t('loginModal.step1')}
        </p>

        <div className="dsh-health-qr-box">
          {qrBase64 ? (
            <img src={qrBase64} alt="Xiaomi Health QR Code" />
          ) : (
            <div
              style={{
                width: '200px',
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#334155',
                fontSize: '13px',
                textAlign: 'center',
                padding: '16px',
              }}
            >
              📱 请使用手机打开「小米运动健康」App 扫描设备绑定二维码
            </div>
          )}
        </div>

        <p style={{ fontSize: '12px', color: '#64748b', margin: '8px 0 16px 0' }}>
          {t('loginModal.waitingScan')}
        </p>

        {loginUrl && (
          <p style={{ fontSize: '12px', margin: '0 0 16px 0' }}>
            <a
              href={loginUrl}
              target="_blank"
              rel="noreferrer"
              style={{ color: '#38bdf8', textDecoration: 'none' }}
            >
              🌐 {t('loginModal.browserLink')}
            </a>
          </p>
        )}

        <button className="dsh-health-btn" onClick={onClose} style={{ width: '100%' }}>
          {t('loginModal.close')}
        </button>
      </div>
    </div>
  )
}
