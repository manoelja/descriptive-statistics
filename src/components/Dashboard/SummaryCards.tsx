import { motion } from 'framer-motion';
import { Activity, Skull, HeartPulse, Percent } from 'lucide-react';
import { sragData } from '../../data/srag';

const s = sragData.dashboardSummary;

const cards = [
  {
    label: 'Notificações',
    value: s.totalNotificacoes,
    icon: <Activity size={18} />,
    color: 'var(--accent-soft)',
    hint: 'SRAG 2026',
  },
  {
    label: 'Óbitos',
    value: s.totalObitos,
    icon: <Skull size={18} />,
    color: 'rgba(248,113,113,0.12)',
    hint: 'EVOLUCAO = 2 ou 3',
  },
  {
    label: 'Internações UTI',
    value: s.totalUTI,
    icon: <HeartPulse size={18} />,
    color: 'rgba(251,191,36,0.12)',
    hint: 'UTI = 1',
  },
  {
    label: 'Taxa de Letalidade',
    value: `${s.taxaLetalidade}%`,
    icon: <Percent size={18} />,
    color: 'var(--lavender-soft)',
    hint: 'óbitos / notificações',
  },
];

const fmt = (v: number | string) => typeof v === 'number' ? v.toLocaleString('pt-BR') : v;

export default function SummaryCards() {
  return (
    <div className="summary-grid">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          className="summary-card cyber-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
        >
          <div className="summary-icon" style={{ background: card.color }}>
            {card.icon}
          </div>
          <span className="summary-label">{card.label}</span>
          <span className="summary-value">{fmt(card.value)}</span>
          <span className="summary-hint">{card.hint}</span>
        </motion.div>
      ))}
    </div>
  );
}
