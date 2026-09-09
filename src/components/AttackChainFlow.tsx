import React, { useState } from 'react';
import { ATTACK_CHAIN_NODES } from '../data/demoData';
import { AttackNode } from '../types';
import { ArrowRight, ShieldCheck, AlertTriangle, ChevronDown, CheckCircle2 } from 'lucide-react';

export const AttackChainFlow: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<AttackNode>(ATTACK_CHAIN_NODES[3]); // Default MFA node

  return (
    <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#DCDAD4] shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#DCDAD4] gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-[#B49562]" />
            <h3 className="text-sm sm:text-base font-bold text-[#292927] tracking-wide">
              Adversary Attack Chain & Causal Propagation
            </h3>
          </div>
          <p className="text-xs text-[#6F6D68] mt-0.5">
            Probabilistic propagation from initial probe to balance sheet liability
          </p>
        </div>

        <span className="text-xs text-[#6F6275] font-mono px-2 py-0.5 rounded bg-[#F1F0EC] border border-[#DCDAD4] font-medium">
          Bayesian Causal DAG
        </span>
      </div>

      {/* Nodes visual flow */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center space-x-2 min-w-[760px] py-2">
          {ATTACK_CHAIN_NODES.map((node, index) => {
            const isSelected = selectedNode.id === node.id;
            const isCritical = node.riskLevel === 'CRITICAL';

            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <button
                  onClick={() => setSelectedNode(node)}
                  className={`flex-1 p-3 rounded-lg border text-left transition-colors relative flex flex-col justify-between min-h-[96px] cursor-pointer ${
                    isSelected
                      ? 'bg-[#6F6275]/15 border-[#6F6275]/50 text-[#292927]'
                      : isCritical
                      ? 'bg-[#A87570]/10 border-[#A87570]/30 hover:bg-[#A87570]/15'
                      : 'bg-[#F1F0EC] border-[#DCDAD4] hover:bg-[#E9E7E1]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-[9px] font-mono font-medium px-1.5 py-0.5 rounded border ${
                      isCritical ? 'bg-[#A87570]/15 text-[#A87570] border-[#A87570]/30' : 'bg-[#F7F6F2] text-[#6F6D68] border-[#DCDAD4]'
                    }`}>
                      {node.riskLevel.charAt(0) + node.riskLevel.slice(1).toLowerCase()}
                    </span>
                    <span className="text-[10px] font-medium text-[#6F6275]">
                      {node.metric}
                    </span>
                  </div>

                  <div className="mt-2">
                    <div className="font-medium text-[11px] text-[#292927] leading-tight">
                      {node.label}
                    </div>
                    <div className="text-[9px] text-[#6F6D68] truncate mt-0.5 font-mono">
                      {node.stage}
                    </div>
                  </div>
                </button>

                {/* Connecting Arrow */}
                {index < ATTACK_CHAIN_NODES.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-[#6F6D68] flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Node Detailed Inspection Panel */}
      {selectedNode && (
        <div className="p-4 rounded-lg bg-[#F7F6F2] border border-[#DCDAD4] grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="md:col-span-2 space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-[#292927] text-sm tracking-wide">
                Stage Detail: {selectedNode.label}
              </span>
              <span className="px-2 py-0.5 rounded bg-[#F1F0EC] text-[#6F6D68] font-mono text-[10px]">
                {selectedNode.metric}
              </span>
            </div>
            <p className="text-[#6F6D68] leading-relaxed">
              {selectedNode.description}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#F1F0EC] border border-[#718C78]/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-1.5 text-[#718C78] font-medium text-[11px] font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Primary defensive mitigation</span>
              </div>
              <p className="text-[#292927] mt-1.5 font-medium text-[11px]">
                {selectedNode.mitigation}
              </p>
            </div>
            <span className="text-[10px] text-[#6F6D68] mt-2 font-mono">
              Evaluated in 0/1 Knapsack Engine
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
