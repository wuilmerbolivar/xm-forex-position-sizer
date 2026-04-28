export type XmAffiliateLinkId =
  | 'home'
  | 'realAccount'
  | 'education'
  | 'app'
  | 'promotions'
  | 'support'
  | 'copyTrading'
  | 'calculators'
  | 'about'
  | 'demoAccount'
  | 'accountTypes'
  | 'userAccess'
  | 'mt5';

export interface XmAffiliateLink {
  id: XmAffiliateLinkId;
  label: string;
  href: string;
  description: string;
}

export const XM_ASSOCIATE_CODE = 'M32JB';

export const XM_AFFILIATE_LINKS: Record<XmAffiliateLinkId, XmAffiliateLink> = {
  home: {
    id: 'home',
    label: 'Pagina de inicio',
    href: 'https://clicks.pipaffiliates.com/c?c=1218607&l=es&p=0',
    description: 'Entrada general a XM en espanol con tu referido aplicado.',
  },
  realAccount: {
    id: 'realAccount',
    label: 'Abrir cuenta real',
    href: 'https://clicks.pipaffiliates.com/c?c=1218607&l=es&p=1',
    description: 'Ruta principal para cuentas reales dentro del flujo de la herramienta.',
  },
  education: {
    id: 'education',
    label: 'Formacion de trading',
    href: 'https://clicks.pipaffiliates.com/c?c=1218607&l=es&p=7',
    description: 'Formacion oficial de XM para reforzar ejecucion, gestion y contexto.',
  },
  app: {
    id: 'app',
    label: 'App de XM',
    href: 'https://clicks.pipaffiliates.com/c?c=1218607&l=es&p=17',
    description: 'Descarga y acceso a la aplicacion oficial de XM.',
  },
  promotions: {
    id: 'promotions',
    label: 'Promociones y bonos',
    href: 'https://clicks.pipaffiliates.com/c?c=1218607&l=es&p=6',
    description: 'Consulta beneficios activos, campañas y bonos vigentes en XM.',
  },
  support: {
    id: 'support',
    label: 'Atencion al cliente',
    href: 'https://clicks.pipaffiliates.com/c?c=1218607&l=es&p=18',
    description: 'Canal oficial de soporte para validaciones, KYC y dudas operativas.',
  },
  copyTrading: {
    id: 'copyTrading',
    label: 'Copy trading',
    href: 'https://clicks.pipaffiliates.com/c?c=1218607&l=es&p=3901',
    description: 'Acceso directo a la oferta de copy trading de XM.',
  },
  calculators: {
    id: 'calculators',
    label: 'Calculadoras forex de XM',
    href: 'https://clicks.pipaffiliates.com/c?c=1218607&l=es&p=14',
    description: 'Complemento util para contrastar lotaje, margen y parametros externos.',
  },
  about: {
    id: 'about',
    label: 'Acerca de XM',
    href: 'https://clicks.pipaffiliates.com/c?c=1218607&l=es&p=8',
    description: 'Informacion general del broker, regulacion y presencia global.',
  },
  demoAccount: {
    id: 'demoAccount',
    label: 'Abrir cuenta demo',
    href: 'https://clicks.pipaffiliates.com/c?c=1218607&l=es&p=5',
    description: 'Ruta recomendada para practicar antes de fondear.',
  },
  accountTypes: {
    id: 'accountTypes',
    label: 'Tipos de cuenta',
    href: 'https://clicks.pipaffiliates.com/c?c=1218607&l=es&p=2',
    description: 'Comparativo de cuentas para alinear micro o standard con tu plan.',
  },
  userAccess: {
    id: 'userAccess',
    label: 'Acceso usuarios',
    href: 'https://clicks.pipaffiliates.com/c?c=1218607&l=es&p=22',
    description: 'Ingreso al area de usuario y gestion de tu cuenta XM.',
  },
  mt5: {
    id: 'mt5',
    label: 'MetaTrader 5 (MT5)',
    href: 'https://clicks.pipaffiliates.com/c?c=1218607&l=es&p=20',
    description: 'Descarga y acceso directo a MT5 para continuar la ejecucion.',
  },
};

export const XM_STARTER_LINK_IDS = ['home', 'realAccount', 'demoAccount', 'accountTypes'] as const;
export const XM_PLATFORM_LINK_IDS = ['userAccess', 'mt5', 'app', 'calculators'] as const;
export const XM_SUPPORT_LINK_IDS = ['education', 'promotions', 'support', 'copyTrading', 'about'] as const;

export function pickXmLinks(ids: readonly XmAffiliateLinkId[]) {
  return ids.map((id) => XM_AFFILIATE_LINKS[id]);
}
