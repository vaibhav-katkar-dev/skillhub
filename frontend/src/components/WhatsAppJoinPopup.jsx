import React, { useEffect, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/HxtxKbZCw39BNGzy7hXVSt?mode=gi_t';
const POPUP_SEEN_KEY = 'skillvalix_whatsapp_popup_seen';
const POPUP_DELAY_MS = 5000;

const WhatsAppJoinPopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem(POPUP_SEEN_KEY) === '1';
    if (hasSeenPopup) return;

    const timer = window.setTimeout(() => {
      setOpen(true);
    }, POPUP_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  const closePopup = () => {
    localStorage.setItem(POPUP_SEEN_KEY, '1');
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center bg-slate-950/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <MessageCircle className="h-5 w-5" />
            </span>
            <h3 className="text-base font-bold text-slate-900">Join Our Learning Community!</h3>
          </div>
          <button
            type="button"
            onClick={closePopup}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-3 text-sm text-slate-600 whitespace-pre-line">
          Learn Python, JavaScript & AI for FREE {"\n\n"}
          ✔ Free Courses{"\n"}
          ✔ Certificates{"\n"}
          ✔ Career Tips{"\n"}
          ✔ Real Opportunities{"\n\n"}
          👉 Start your journey now
        </p>

        <div className="mt-4 flex gap-2">
          <a
            href={WHATSAPP_GROUP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closePopup}
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
          >
            Join Now
          </a>
          <button
            type="button"
            onClick={closePopup}
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppJoinPopup;
