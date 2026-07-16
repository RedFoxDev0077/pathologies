import { S8Analysis } from '@/types/expediente';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { S8UpgradeScreen } from './S8UpgradeScreen';

interface S8AnalysisDisplayProps {
  analysis: S8Analysis;
  caseId: string;
  /** Internal expediente id, used to route to the report request. */
  expedienteId?: string;
}

export function S8AnalysisDisplay({ analysis, caseId, expedienteId }: S8AnalysisDisplayProps) {
  const blocks = [
    { key: 'block_1_identified_damage', icon: '🔍', color: 'border-l-blue-500' },
    { key: 'block_2_probable_causes', icon: '🧪', color: 'border-l-purple-500' },
    { key: 'block_3_risk_assessment', icon: '⚠️', color: 'border-l-orange-500' },
    { key: 'block_4_technical_questions', icon: '❓', color: 'border-l-green-500' },
    { key: 'block_5_recommendations', icon: '💡', color: 'border-l-yellow-500' },
  ];

  return (
    // id is the print target: the "Descargar en PDF" CTA uses window.print(),
    // and the @media print rules in index.css print only this subtree.
    <div id="s8-analysis-print" className="space-y-4 p-4 md:p-6">
      {/* Case ID Badge */}
      <div className="flex items-center justify-center">
        <Badge variant="outline" className="text-sm md:text-lg px-4 md:px-6 py-1.5 md:py-2 font-mono font-bold">
          📋 Expediente: {caseId}
        </Badge>
      </div>

      <div className="text-center mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold mb-2">Análisis Técnico Preliminar (Gratuito)</h2>
        <p className="text-xs md:text-sm text-muted-foreground px-2">
          Este análisis se basa en la información proporcionada. Para un informe completo revisado por un técnico, solicita el informe preliminar remoto.
        </p>
      </div>

      {/* 5 Blocks */}
      {blocks.map((block) => {
        const data = analysis[block.key as keyof S8Analysis] as { title: string; content: string };

        if (!data || !data.title) return null;

        return (
          <Card key={block.key} className={`border-l-4 ${block.color}`}>
            <CardHeader className="pb-2 md:pb-3">
              <CardTitle className="flex items-center gap-2 md:gap-3 text-base md:text-lg">
                <span className="text-xl md:text-2xl">{block.icon}</span>
                <span>{data.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              <div className="whitespace-pre-wrap text-xs md:text-sm leading-relaxed">
                {data.content}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Confidence Score */}
      <div className="text-center mt-4 md:mt-6 p-3 md:p-4 bg-muted/30 rounded-lg">
        <div className="text-xs md:text-sm text-muted-foreground mb-1">Confianza del análisis</div>
        <div className="text-2xl md:text-3xl font-bold text-primary">{analysis.overall_confidence}%</div>
        <div className="text-[10px] md:text-xs text-muted-foreground mt-1 md:mt-2 px-2">
          Este porcentaje indica el nivel de certeza basado en la información disponible
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-4 md:mt-6 p-3 md:p-4 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-950 dark:border-yellow-800">
        <p className="text-xs md:text-sm text-yellow-800 dark:text-yellow-200">
          <strong>⚠️ Importante:</strong> Este es un análisis preliminar automatizado. No sustituye una inspección presencial ni un informe técnico oficial. Para un diagnóstico definitivo, solicita el informe completo revisado por un técnico cualificado.
        </p>
      </div>

      {/* Upgrade screen (document 3.3 + 3.4). Lives here so it appears wherever
          the analysis is rendered — both the desktop panel and the mobile tab. */}
      <S8UpgradeScreen
        analysis={analysis}
        caseId={caseId}
        expedienteId={expedienteId}
      />
    </div>
  );
}
