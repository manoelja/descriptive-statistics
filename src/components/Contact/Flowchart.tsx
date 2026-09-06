import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, PieChart, Hash, TrendingUp,
  Calculator, GitBranch, Layers,
  Database, FileCode, FileJson,
  LayoutDashboard, TestTube, BookOpen, Package,
} from 'lucide-react';

interface PipelineStep {
  icon: React.ReactNode;
  label: string;
  color: string;
}

interface Pipeline {
  title: string;
  tag: string;
  steps: PipelineStep[];
}

const dataPipeline: Pipeline = {
  title: 'Pipeline de Análise',
  tag: 'DADOS',
  steps: [
    { icon: <BarChart3 size={16} />, label: 'Item 1\nSexo', color: '#22c55e' },
    { icon: <PieChart size={16} />, label: 'Item 2\nRaça/Cor', color: '#2dd4bf' },
    { icon: <Hash size={16} />, label: 'Item 3\nClassificação', color: '#7dd3fc' },
    { icon: <TrendingUp size={16} />, label: 'Item 4\nHistograma', color: '#a78bfa' },
    { icon: <Calculator size={16} />, label: 'Item 5\nResumo', color: '#f472b6' },
    { icon: <GitBranch size={16} />, label: 'Item 6\nModa', color: '#fbbf24' },
    { icon: <Layers size={16} />, label: 'Item 7\nCruzada', color: '#fb923c' },
    { icon: <BarChart3 size={16} />, label: 'Item 8\nBox-Plot', color: '#f87171' },
  ],
};

const projectPipeline: Pipeline = {
  title: 'Pipeline do Projeto',
  tag: 'PROJETO',
  steps: [
    { icon: <Database size={16} />, label: 'CSV\nSIVEP-Gripe', color: '#22c55e' },
    { icon: <FileCode size={16} />, label: 'Node.js\nexport-data', color: '#2dd4bf' },
    { icon: <FileJson size={16} />, label: 'srag.ts\nPré-processado', color: '#7dd3fc' },
    { icon: <TestTube size={16} />, label: 'Vitest\n15 testes', color: '#a78bfa' },
    { icon: <BookOpen size={16} />, label: 'i18n\nPT/EN/ES', color: '#f472b6' },
    { icon: <LayoutDashboard size={16} />, label: 'React\nDashboard', color: '#fbbf24' },
    { icon: <Package size={16} />, label: 'FormulasLab\n8 fórmulas', color: '#fb923c' },
    { icon: <LayoutDashboard size={16} />, label: 'Produção\nBuild final', color: '#f87171' },
  ],
};

const PipelineRow = ({ pipeline, index }: { pipeline: Pipeline; index: number }) => {
  const [activeStep, setActiveStep] = useState(-1);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepRef = useRef(0);

  // Auto-play flash
  useEffect(() => {
    setActiveStep(0);
    stepRef.current = 0;

    autoRef.current = setInterval(() => {
      stepRef.current = (stepRef.current + 1) % pipeline.steps.length;
      setActiveStep(stepRef.current);
    }, 1200);

    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [pipeline.steps.length]);

  // Hover overrides auto-play
  const handleEnter = useCallback((i: number) => {
    setActiveStep(i);
    if (autoRef.current) clearInterval(autoRef.current);
  }, []);

  const handleLeave = useCallback(() => {
    // Resume auto-play from current step
    stepRef.current = activeStep;
    autoRef.current = setInterval(() => {
      stepRef.current = (stepRef.current + 1) % pipeline.steps.length;
      setActiveStep(stepRef.current);
    }, 1200);
  }, [activeStep, pipeline.steps.length]);

  // Touch support for mobile
  const handleTouch = useCallback((i: number) => {
    if (autoRef.current) clearInterval(autoRef.current);
    setActiveStep(i);
    // Resume auto-play after 2 seconds
    setTimeout(() => {
      stepRef.current = i;
      autoRef.current = setInterval(() => {
        stepRef.current = (stepRef.current + 1) % pipeline.steps.length;
        setActiveStep(stepRef.current);
      }, 1200);
    }, 2000);
  }, [pipeline.steps.length]);

  return (
    <motion.div
      className="pipeline-section"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
    >
      <div className="pipeline-header-row">
        <span className="pipeline-tag" style={{ borderColor: pipeline.steps[0].color }}>
          {pipeline.tag}
        </span>
        <span className="pipeline-title">{pipeline.title}</span>
      </div>

      <div className="pipeline-track">
        {pipeline.steps.map((step, i) => (
          <div
            key={i}
            className="pipeline-node"
            onMouseEnter={() => handleEnter(i)}
            onMouseLeave={handleLeave}
            onTouchStart={() => handleTouch(i)}
          >
            {/* Green flash indicator */}
            <motion.div
              className="step-flash"
              animate={activeStep === i ? {
                opacity: [0, 1, 1, 0],
                scale: [0.8, 1.2, 1.2, 0.8],
              } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />

            <motion.div
              className="node-dot"
              style={{ background: step.color }}
              animate={activeStep === i ? {
                boxShadow: [
                  `0 0 4px ${step.color}00`,
                  `0 0 16px ${step.color}80`,
                  `0 0 16px ${step.color}80`,
                  `0 0 4px ${step.color}00`,
                ],
                scale: [1, 1.3, 1.3, 1],
              } : {
                boxShadow: `0 0 4px ${step.color}00`,
                scale: 1,
              }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />

            <motion.div
              className="node-icon"
              style={{ borderColor: `${step.color}40`, color: step.color }}
              animate={activeStep === i ? {
                borderColor: step.color,
                background: `${step.color}15`,
                y: -2,
              } : {
                borderColor: `${step.color}40`,
                background: 'var(--accent-soft)',
                y: 0,
              }}
              transition={{ duration: 0.3 }}
            >
              {step.icon}
            </motion.div>

            <span className="node-label">
              {step.label.split('\n').map((line, li) => (
                <motion.span
                  key={li}
                  className={li === 0 ? 'label-title' : 'label-sub'}
                  animate={activeStep === i ? { color: '#ffffff' } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {line}
                </motion.span>
              ))}
            </span>

            {i < pipeline.steps.length - 1 && (
              <div className="node-connector">
                <motion.div
                  className="connector-line"
                  animate={activeStep === i ? {
                    background: `linear-gradient(90deg, ${step.color}, ${pipeline.steps[i + 1].color})`,
                    opacity: 0.6,
                  } : {
                    background: 'var(--grid-line)',
                    opacity: 0.3,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const Flowchart = () => {
  return (
    <div className="flowchart-wrapper">
      <PipelineRow pipeline={dataPipeline} index={0} />
      <PipelineRow pipeline={projectPipeline} index={1} />
    </div>
  );
};

export default Flowchart;
