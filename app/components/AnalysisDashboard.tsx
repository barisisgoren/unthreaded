'use client';

import { AnalysisResult, DiffResult } from '../types';
import { Users, UserMinus, Heart, UserCheck } from 'lucide-react';
import StatCard from './StatCard';
import { HistoricalReport } from '../types';

interface AnalysisDashboardProps {
  result: AnalysisResult;
  diff?: DiffResult | null;
  history?: HistoricalReport[];
}

export default function AnalysisDashboard({ result }: AnalysisDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Takipçiler" value={result.followersCount} icon={Users} index={0} />
        <StatCard title="Takip Edilenler" value={result.followingCount} icon={UserCheck} index={1} />
        <StatCard title="Geri Takip Etmeyenler" value={result.unfollowers.length} icon={UserMinus} index={2} />
        <StatCard title="Hayranlar" value={result.fans.length} icon={Heart} index={3} />
      </div>
    </div>
  );
}
