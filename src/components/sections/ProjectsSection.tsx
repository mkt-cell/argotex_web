import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Building2, Clock } from 'lucide-react';
import type { ProjectItem } from '@/lib/api';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  dict: {
    title: string;
    desc: string;
    duration_label: string;
    project_type_label: string;
  };
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects, dict }) => {
  if (projects.length === 0) return null;

  return (
    <section id="projects" className="py-20 lg:py-24 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-3xl space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800 font-heading">
            {dict.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl leading-relaxed font-sans">
            {dict.desc}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col gap-4 p-6">
              <Badge className="w-fit">{project.resultMetric}</Badge>

              <h3 className="text-lg font-bold tracking-tight text-slate-800 font-heading">
                {project.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">
                {project.successStory}
              </p>

              <div className="border-t border-slate-100 pt-4 space-y-2 font-sans">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Building2 className="h-3.5 w-3.5 text-medical-teal flex-shrink-0" />
                  <span>{project.clientName} · {project.projectType}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Clock className="h-3.5 w-3.5 text-medical-teal flex-shrink-0" />
                  <span>{dict.duration_label}: {project.durationMonths} {project.durationMonths === 1 ? 'month' : 'months'}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
