import { useEffect } from 'react';
import { ExternalLink, MessageCircle, X } from 'lucide-react';
import {
  XM_ASSOCIATE_CODE,
  XM_AFFILIATE_LINKS,
  XM_PLATFORM_LINK_IDS,
  XM_STARTER_LINK_IDS,
  XM_SUPPORT_LINK_IDS,
  pickXmLinks,
} from '../lib/xmAffiliate';

interface XMDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STARTER_LINKS = pickXmLinks(XM_STARTER_LINK_IDS);
const PLATFORM_LINKS = pickXmLinks(XM_PLATFORM_LINK_IDS);
const SUPPORT_LINKS = pickXmLinks(XM_SUPPORT_LINK_IDS);

const XM_DIRECTORY_STATS = [
  { label: 'Clientes', value: '+20M', hint: 'XM reporta clientes en mas de 190 paises.' },
  { label: 'Cobertura', value: '+190', hint: 'Presencia internacional con acceso a multiples mercados.' },
  { label: 'Ejecucion', value: '99%', hint: 'XM indica ejecuciones en menos de un segundo.' },
  { label: 'Acceso', value: 'Libre', hint: 'Esta calculadora es publica y de libre acceso.' },
] as const;

export function XMDirectoryModal({ isOpen, onClose }: XMDirectoryModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[120] overflow-y-auto bg-[rgba(4,9,13,0.78)] px-4 py-5 backdrop-blur-md md:px-6 md:py-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="xm-directory-title"
    >
      <div className="mx-auto max-w-6xl">
        <section
          className="overflow-hidden rounded-[2rem] border border-[var(--border-strong)] bg-[linear-gradient(180deg,rgba(13,19,26,0.98),rgba(10,16,22,0.98))] shadow-[0_34px_90px_rgba(0,0,0,0.52)]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex flex-col gap-4 border-b border-[var(--border-muted)] px-6 py-6 md:flex-row md:items-start md:justify-between md:px-8">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-[var(--accent-amber)]/25 bg-[var(--accent-amber)]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--accent-amber)]">
                  Directorio XM
                </span>
                <span className="inline-flex items-center rounded-full border border-[var(--border-muted)] bg-white/4 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                  Codigo {XM_ASSOCIATE_CODE}
                </span>
              </div>
              <h2 id="xm-directory-title" className="mt-4 text-[2rem] font-semibold leading-[1.04] text-white md:text-[2.35rem]">
                XM como referencia operativa para metales, forex e indices.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-secondary)] md:text-[15px]">
                XM se presenta como un broker global orientado a ofrecer acceso a los mercados con condiciones claras,
                ejecucion agil y acompanamiento para traders de distintos niveles. Dentro de esta herramienta publica y
                de libre acceso, funciona como el entorno de referencia para preparar entradas en metales, forex e
                indices antes de operar.
              </p>
            </div>

            <button
              onClick={onClose}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--border-strong)] bg-white/4 text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
              aria-label="Cerrar directorio XM"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-6 px-6 py-6 md:px-8 md:py-8 xl:grid-cols-[0.88fr_1.12fr]">
            <div className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {XM_DIRECTORY_STATS.map((stat) => (
                  <div key={stat.label} className="rounded-[1.35rem] border border-[var(--border-muted)] bg-white/3 p-4">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--text-faint)]">{stat.label}</p>
                    <p className="mt-2 text-xl font-semibold text-white">{stat.value}</p>
                    <p className="mt-2 text-xs leading-6 text-[var(--text-secondary)]">{stat.hint}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[1.6rem] border border-[var(--accent-amber)]/22 bg-[linear-gradient(135deg,rgba(247,185,85,0.14),rgba(247,185,85,0.04))] p-5">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--accent-amber)]">Accesos clave</p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <a
                    href={XM_AFFILIATE_LINKS.realAccount.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-between rounded-2xl bg-[var(--accent-amber)] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--bg-primary)] transition-transform hover:-translate-y-0.5 md:col-span-2"
                  >
                    Abrir cuenta real
                    <ExternalLink size={15} />
                  </a>
                  <a
                    href={XM_AFFILIATE_LINKS.demoAccount.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-between rounded-2xl border border-[var(--border-strong)] bg-white/4 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:border-[var(--accent-amber)] hover:text-[var(--accent-amber)]"
                  >
                    Abrir demo
                    <ExternalLink size={15} />
                  </a>
                  <a
                    href={XM_AFFILIATE_LINKS.userAccess.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-between rounded-2xl border border-[var(--border-strong)] bg-white/4 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
                  >
                    Acceso usuarios
                    <ExternalLink size={15} />
                  </a>
                  <a
                    href="https://wa.me/51987435331?text=Hola,%20vengo%20de%20XM%20Forex%20Position%20Sizer%20y%20quiero%20acompanamiento%20para%20mi%20cuenta."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-between rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300 transition-colors hover:bg-emerald-400/16 md:col-span-2"
                  >
                    <span className="inline-flex items-center gap-2">
                      <MessageCircle size={15} />
                      Hablar por WhatsApp
                    </span>
                    <ExternalLink size={15} />
                  </a>
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-[var(--border-muted)] bg-black/12 p-5">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-faint)]">Presentacion XM</p>
                <div className="mt-4 space-y-4 text-sm leading-7 text-[var(--text-secondary)]">
                  <div className="border-b border-[var(--border-muted)] pb-4">
                    <p className="font-semibold text-white">Presencia global</p>
                    <p className="mt-2">
                      XM comunica una presencia internacional amplia y una propuesta centrada en acercar metales,
                      forex, indices y otros instrumentos a traders de perfiles distintos.
                    </p>
                  </div>
                  <div className="border-b border-[var(--border-muted)] pb-4">
                    <p className="font-semibold text-white">Mision operativa</p>
                    <p className="mt-2">
                      Su enfoque comercial gira en torno a condiciones consistentes, velocidad de ejecucion y acceso a
                      recursos oficiales para que cada decision llegue mejor preparada al momento de abrir una orden.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Uso dentro de esta herramienta</p>
                    <p className="mt-2">
                      Esta calculadora toma a XM como referencia para organizar el riesgo, dimensionar posiciones y
                      revisar accesos oficiales desde una experiencia abierta, publica y accesible libremente.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { title: 'Inicio y cuentas', intro: 'Rutas para aterrizar, comparar y abrir la cuenta adecuada.', links: STARTER_LINKS },
                { title: 'Plataformas y acceso', intro: 'Accesos directos para ejecutar, entrar y contrastar parametros.', links: PLATFORM_LINKS },
                { title: 'Aprendizaje y soporte', intro: 'Contenido, promociones y ayuda oficial cuando el usuario necesita contexto.', links: SUPPORT_LINKS },
              ].map((group) => (
                <section key={group.title} className="rounded-[1.55rem] border border-[var(--border-muted)] bg-white/3 p-5">
                  <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--text-faint)]">Grupo XM</p>
                      <h3 className="mt-2 text-lg font-semibold text-white">{group.title}</h3>
                    </div>
                    <p className="max-w-md text-xs leading-6 text-[var(--text-secondary)]">{group.intro}</p>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {group.links.map((link) => (
                      <a
                        key={link.id}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-[1.2rem] border border-[var(--border-muted)] bg-black/12 p-4 transition-colors hover:border-[var(--accent-primary)] hover:bg-white/4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-white">{link.label}</p>
                            <p className="mt-2 text-xs leading-6 text-[var(--text-secondary)]">{link.description}</p>
                          </div>
                          <ExternalLink className="mt-0.5 shrink-0 text-[var(--accent-primary)]" size={15} />
                        </div>
                      </a>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
