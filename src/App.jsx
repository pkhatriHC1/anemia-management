import { useState, useEffect, useRef } from "react";
import { Search, Filter, ChevronDown, ArrowRight, ChevronLeft, MessageSquare, ClipboardList, User, Hash, Stethoscope, CircleAlert as AlertCircle, TriangleAlert as AlertTriangle, Info, ShieldCheck, Activity, ArrowLeft } from "lucide-react";
import { Button } from "./components/hc1/Button";
import { Badge } from "./components/hc1/Badge";
import { Gauge as HC1Gauge } from "./components/hc1/Gauge";
import { CareCoordination, getPendingCount } from "./components/hc1/CareCoordination/CareCoordination";
import { BloodHealthAppNav } from "./components/hc1/BloodHealthAppNav";

const C={grey:{100:"#FFFFFF",200:"#F7F7F7",300:"#E7E7E7",400:"#CFD1D1",500:"#A8ADAD",600:"#737E7F",700:"#545D5E",800:"#273233"},primary:{100:"#ECF4F5",200:"#CFE4E6",300:"#9EC9CD",400:"#56A0A8",500:"#0D7782",600:"#0B626B"},secondary:{100:"#E1F3F5",200:"#CFEBEE",300:"#AFDCE1",400:"#75CAD3",500:"#3CA6B0",600:"#1D828C"},orange:{100:"#FFEFE0",400:"#F58126"},yellow:{100:"#FFECC1",400:"#FFC432"},error:{100:"#F4DFE4",400:"#B00A2F"},success:{100:"#D7E7D6",400:"#388032"},red:{100:"#EFB0AB",400:"#C6473C"}};
const font="var(--hc-font-sans)";
const fmtCaseDate=(s)=>{const d=new Date(s);if(isNaN(d))return s;const mm=String(d.getMonth()+1).padStart(2,"0");const dd=String(d.getDate()).padStart(2,"0");const yyyy=d.getFullYear();return `${mm}/${dd}/${yyyy}`;};
// 4-tier severity chip — SEVERE / MODERATE / MILD / NORMAL — used for TRS, Anemia Grade
const SEV4_TIER={severe:"critical",moderate:"high",mild:"medium",normal:"normal"};
const SEV4_LABEL={severe:"SEVERE",moderate:"MODERATE",mild:"MILD",normal:"NORMAL"};
const SEV4_VARIANT={critical:"danger",high:"warning",medium:"warning",normal:"success"};
const SEV4_ICON={critical:AlertCircle,high:AlertTriangle,medium:AlertTriangle,normal:ShieldCheck};
const SevChip=({tier})=>{const t=SEV4_TIER[tier]||"normal";const Icon=SEV4_ICON[t];return <Badge variant={SEV4_VARIANT[t]} appearance="soft" size="sm" leadingIcon={<Icon strokeWidth={1.5}/>}>{SEV4_LABEL[tier]||"NORMAL"}</Badge>;};
// Map TRS trsSev → 4-tier: very-high → severe, high → moderate, medium → mild, low → normal
const trsTier=(sev)=>sev==="very-high"?"severe":sev==="high"?"moderate":sev==="medium"?"mild":"normal";
const TRC={"very-high":C.error[400],"high":C.orange[400],"medium":"#92600A","low":C.success[400]};
// Anemia severity scale for surgical patients — 4 tiers per clinical consensus
// Severe ≤8.0 · Moderate 8.1–11.0 · Mild 11.1–12.9 · No Anemia >13.0
const getAnemiaGrade=(hgb)=>{const h=parseFloat(hgb);if(h>13.0)return{label:"No Anemia",tier:"normal",color:C.success[400],bg:C.success[100]};if(h>=11.1)return{label:"Mild",tier:"mild",color:"#92600A",bg:C.yellow[100]};if(h>=8.1)return{label:"Moderate",tier:"moderate",color:C.orange[400],bg:C.orange[100]};return{label:"Severe",tier:"severe",color:C.error[400],bg:C.error[100]};};
// Delta-Hb% risk: ≥50% drop from baseline = significantly elevated mortality risk
const getDeltaRisk=(draws)=>{if(!draws||draws.length<2)return null;const baseline=draws[0].value;const current=draws[draws.length-1].value;if(current>=baseline)return null;const pct=Math.round(((baseline-current)/baseline)*100);return{pct,isRisk:pct>=50};};
const CASE_TYPES=["All Case Types","CARDIAC","ENT","GASTRO INTESTINAL","GENERAL SURGERY","NEUROSURGERY","ORTHO","PLASTICS/RECONSTRUCTION","SPINE","THORACIC","UROLOGY/GU","VASCULAR","WOMEN'S HEALTH-SURGICAL"];

const BloodDrop=({size=15,color})=><svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none"><path d="M12 2C12 2 5 10.5 5 15a7 7 0 0 0 14 0c0-4.5-7-13-7-13z"/></svg>;
const Pregnant=({size=15,color})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="4" r="2"/><path d="M9 8h3l1 4c1.5 0 3 1.5 3 3.5S14.5 19 13 19H9"/><path d="M9 8l-1 5"/><path d="M8 13l-1 6"/></svg>;
const Send=({size=12})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const CheckCircle=({size=24,color})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;

const normSev=(s)=>s==="critical"?"critical":s==="high"||s==="borderline"?"high":"low";
const LAB_VARIANT={critical:"danger",high:"warning",low:"neutral"};
const LAB_ICON={critical:AlertCircle,high:AlertTriangle,low:Info};
const LAB_LABEL={critical:"Critical",high:"High",low:"Low"};
const StatusChip=({status})=>{const t=normSev(status);const Icon=LAB_ICON[t];return <Badge variant={LAB_VARIANT[t]} appearance="soft" size="sm" leadingIcon={<Icon strokeWidth={1.5}/>}>{LAB_LABEL[t]}</Badge>;};
// Small right-aligned step action row: optional back button + primary/cta action on the right.
// nextOrange=true marks execute/irreversible steps (Approve & Create Orders, Activate Order,
// Send to All Recipients). Nav-only steps stay primary.
const StepActions=({onBack,backLabel="← Back",onNext,nextLabel,nextOrange=false,backGhost=false})=>(
  <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:8,paddingTop:16,borderTop:`0.5px solid ${C.grey[300]}`,marginTop:16}}>
    {onBack&&(backGhost?<Button variant="ghost" size="md" onClick={onBack}>{backLabel}</Button>:<Button variant="secondary" size="md" onClick={onBack}>{backLabel}</Button>)}
    <Button variant={nextOrange?"cta":"primary"} size="md" onClick={onNext}>{nextLabel}</Button>
  </div>
);

// Map TRS trsSev → StatusChip tier for the hc1 Gauge component
const TRS_GAUGE_TIER={"very-high":"critical","high":"high","medium":"medium","low":"low"};
const TRSGauge=({value,trsSev,size=44})=><HC1Gauge value={value} tier={TRS_GAUGE_TIER[trsSev]||"low"} sizePx={size}/>;

const calcTRS=(p)=>{
  let score=0;const breakdown=[];const full=[];
  const hgb=parseFloat(p.labs.find(l=>l.label==="HGB")?.value??99);
  const hs=hgb<10?2:hgb<13?1:0;score+=hs;if(hs>0)breakdown.push({item:hgb<10?"Hgb <10.0 g/dL":"Hgb 10.0–12.9 g/dL",pts:hs});
  full.push({label:"Hemoglobin",value:p.labs.find(l=>l.label==="HGB")?.value+" g/dL",criteria:hgb<10?"<10.0":hgb<13?"10–12.9":"≥13",maxPts:2,earnedPts:hs});
  const crLab=p.labs.find(l=>l.label==="Creatinine");const cr=crLab?parseFloat(crLab.value):0;
  const cs=cr>=2?2:cr>=1.2?1:0;score+=cs;if(cs>0)breakdown.push({item:`Creatinine ${cr>=2?"≥2.0":"1.2–1.9"} mg/dL`,pts:cs});
  full.push({label:"Creatinine",value:(crLab?.value??"N/A")+" mg/dL",criteria:cr>=2?"≥2.0":cr>=1.2?"1.2–1.9":"<1.2",maxPts:2,earnedPts:cs});
  const wt=parseFloat(p.weight);const ws=wt<75?1:0;score+=ws;if(ws>0)breakdown.push({item:"Weight <75 kg",pts:1});
  full.push({label:"Weight",value:p.weight,criteria:wt<75?"<75 kg":">75",maxPts:1,earnedPts:ws});
  const ss=p.sex==="Female"?1:0;score+=ss;if(ss>0)breakdown.push({item:"Female sex",pts:1});
  full.push({label:"Gender",value:p.sex.toLowerCase(),criteria:p.sex==="Female"?"female":"male",maxPts:1,earnedPts:ss});
  const as=p.age>=65?1:0;score+=as;if(as>0)breakdown.push({item:"Age ≥65 years",pts:1});
  full.push({label:"Age",value:p.age+" years",criteria:p.age>=65?"≥65":"<65",maxPts:1,earnedPts:as});
  const ps=p.procedureWithin2Weeks?1:0;score+=ps;if(ps>0)breakdown.push({item:"Procedure <2 weeks",pts:1});
  full.push({label:"Surgery Timing",value:p.procedureWithin2Weeks?"<2 weeks":"≥2 weeks",criteria:"scheduled",maxPts:1,earnedPts:ps});
  const rs=p.redoOrNonIsolated?1:0;score+=rs;if(rs>0)breakdown.push({item:"Redo/non-isolated procedure",pts:1});
  full.push({label:"Redo Procedure",value:p.redoOrNonIsolated?"Yes":"No",criteria:"previous surgery",maxPts:1,earnedPts:rs});
  full.push({label:"Non-Isolated Surgery",value:"No",criteria:"complex procedure",maxPts:1,earnedPts:0});
  const cms=p.significantComorbidities?1:0;score+=cms;if(cms>0)breakdown.push({item:"Significant comorbidities",pts:1});
  full.push({label:"Comorbidities",value:p.significantComorbidities?"Present":"None",criteria:"significant",maxPts:1,earnedPts:cms});
  const acs=p.anticoagulants?1:0;score+=acs;if(acs>0)breakdown.push({item:"Anticoagulants/bleeding-risk meds",pts:1});
  full.push({label:"Anticoagulant Use",value:p.anticoagulants?"Yes":"No",criteria:"bleeding-risk meds",maxPts:1,earnedPts:acs});
  let category,trsSev;
  if(score>=4){category="Very High Risk";trsSev="very-high";}
  else if(score===3){category="High Risk";trsSev="high";}
  else if(score===2){category="Intermediate Risk";trsSev="medium";}
  else{category="Low Risk";trsSev="low";}
  const actions={"low":["Routine monitoring","Oral iron if Hgb <12","Standard blood conservation","Re-evaluate if status changes"],"medium":["Enhanced anemia monitoring","Consider IV iron therapy","Blood conservation strategy","Discuss transfusion threshold"],"high":["IV iron therapy if Hgb <13 g/dL","Type and crossmatch 2–4 units","Multidisciplinary planning","Consider erythropoietin","Cell salvage recommended"],"very-high":["Urgent IV iron and/or EPO","Type and crossmatch ≥4 units","Delay elective procedure","Cell salvage mandatory"]}[trsSev];
  return{score,category,trsSev,breakdown,fullBreakdown:full,actions};
};

const PATIENTS=[
  // SEVERE (HGB ≤8.0) — with >50% ΔHb% risk flag
  {id:"CM-8834",name:"Carlos Medina",age:59,dob:"03/12/1967",sex:"Male",weight:"82 kg",bmi:"27.4",npi:"5544332211",domain:"Anemia",caseType:"GENERAL SURGERY",procedureWithin2Weeks:false,redoOrNonIsolated:true,significantComorbidities:true,anticoagulants:false,
   procedure:"Laparoscopic Colectomy",
   labs:[{label:"HGB",value:"7.4",unit:"g/dL",status:"critical",draws:[{date:"Apr 4",value:9.8},{date:"Apr 5",value:9.1},{date:"Apr 6",value:8.4},{date:"Apr 8",value:7.9},{date:"Apr 9",value:7.4}]},{label:"Ferritin",value:"8",unit:"ng/mL",status:"critical"},{label:"TIBC",value:"480",unit:"mcg/dL",status:"high"},{label:"Transferrin Sat",value:"4",unit:"%",status:"critical"},{label:"Reticulocytes",value:"0.8",unit:"%",status:"low"},{label:"WBC",value:"14.2",unit:"K/uL",status:"high"},{label:"Platelets",value:"310",unit:"K/uL",status:"low"},{label:"Creatinine",value:"1.4",unit:"mg/dL",status:"high"}],
   conditions:["Post-op Colectomy","T2DM"],order:"Rapid Response – Hgb drop 2.4 g/dL / 24h",provider:"Dr. Nguyen",providerRole:"Attending",unit:"6-South ICU Step-Down",admitDate:"Apr 6, 2026",severity:"Severe",carePlanStatus:"pending",aiNote:"Immediate transfusion threshold review. Hgb trajectory suggests acute blood loss in post-surgical context.",aiConfidence:88,diagnosis:"Acute Anemia — Iron Deficiency with Active Blood Loss",icdCodes:["D62","D50.0","K63.5"],transfusionHistory:[{date:"None recorded"}],allergies:["NKDA"],medications:["Metoprolol 25mg BID","Metformin 1000mg BID","Piperacillin-Tazobactam 3.375g IV q6h"]},
  // MODERATE (HGB 8.1–11.0)
  {id:"DM-5521",name:"Dorothy Marsh",age:72,dob:"08/30/1954",sex:"Female",weight:"67 kg",bmi:"24.1",npi:"5544332212",domain:"Anemia",caseType:"ORTHO",procedureWithin2Weeks:false,redoOrNonIsolated:false,significantComorbidities:true,anticoagulants:false,
   procedure:"Total Knee Arthroplasty",
   labs:[{label:"HGB",value:"10.1",unit:"g/dL",status:"high",draws:[{date:"Mar 12",value:11.8},{date:"Mar 26",value:10.8},{date:"Apr 2",value:10.1}]},{label:"Ferritin",value:"14",unit:"ng/mL",status:"high"},{label:"TIBC",value:"395",unit:"mcg/dL",status:"high"},{label:"Transferrin Sat",value:"16",unit:"%",status:"high"},{label:"Reticulocytes",value:"1.1",unit:"%",status:"low"},{label:"WBC",value:"7.8",unit:"K/uL",status:"low"},{label:"Platelets",value:"240",unit:"K/uL",status:"low"},{label:"Creatinine",value:"1.9",unit:"mg/dL",status:"high"}],
   conditions:["RA","CKD 3","Anemia of Chronic Disease"],order:"IV Iron optimization – surgery in 18 days",provider:"Dr. Patel",providerRole:"Attending",unit:"Hematology Outpatient",admitDate:"Apr 2, 2026",severity:"Moderate",carePlanStatus:"in-progress",aiNote:"Pre-surgical optimization window is 18 days. IV iron indicated.",aiConfidence:92,diagnosis:"Pre-surgical Iron Deficiency Anemia — Chronic Disease",icdCodes:["D63.1","D50.9","M79.3"],transfusionHistory:[{date:"Feb 2024",product:"2u pRBC"},{date:"Nov 2023",product:"1u pRBC"}],allergies:["Sulfa drugs"],medications:["Methotrexate 15mg weekly","Folic Acid 1mg daily","Lisinopril 10mg daily","Hydroxychloroquine 200mg BID"]},
  // MODERATE — cardiac, recovering
  {id:"JK-2210",name:"James Kowalski",age:66,dob:"01/14/1960",sex:"Male",weight:"95 kg",bmi:"30.2",npi:"5544332213",domain:"Anemia",caseType:"CARDIAC",procedureWithin2Weeks:false,redoOrNonIsolated:false,significantComorbidities:true,anticoagulants:true,
   procedure:"Coronary Artery Bypass Graft",
   labs:[{label:"HGB",value:"8.9",unit:"g/dL",status:"high",draws:[{date:"Apr 6",value:7.2},{date:"Apr 9",value:8.9}]},{label:"Ferritin",value:"42",unit:"ng/mL",status:"low"},{label:"TIBC",value:"310",unit:"mcg/dL",status:"low"},{label:"Transferrin Sat",value:"28",unit:"%",status:"low"},{label:"Reticulocytes",value:"2.4",unit:"%",status:"high"},{label:"WBC",value:"8.1",unit:"K/uL",status:"low"},{label:"Platelets",value:"188",unit:"K/uL",status:"low"},{label:"BNP",value:"480",unit:"pg/mL",status:"high"}],
   conditions:["CHF","CKD 2"],order:"Transfusion threshold re-evaluation",provider:"Dr. Singh",providerRole:"Cardiologist",unit:"Cardiology 4-West",admitDate:"Apr 5, 2026",severity:"Moderate",carePlanStatus:"generated",aiNote:"Transfusion response adequate. CHF context suggests conservative threshold.",aiConfidence:85,diagnosis:"Post-transfusion Anemia — Chronic Disease in CHF",icdCodes:["D63.1","I50.32","N18.2"],transfusionHistory:[{date:"Apr 8, 2026",product:"2u pRBC",response:"Hgb +1.7"},{date:"Jan 2026",product:"1u pRBC"}],allergies:["NKDA"],medications:["Furosemide 40mg BID","Carvedilol 12.5mg BID","Spironolactone 25mg daily","Empagliflozin 10mg daily"]},
  // MILD (HGB 11.1–12.9)
  {id:"RP-4401",name:"Rita Patel",age:81,dob:"05/21/1945",sex:"Female",weight:"58 kg",bmi:"21.3",npi:"5544332214",domain:"Anemia",caseType:"WOMEN'S HEALTH-SURGICAL",procedureWithin2Weeks:true,redoOrNonIsolated:false,significantComorbidities:true,anticoagulants:false,
   procedure:"Hysterectomy",
   labs:[{label:"HGB",value:"11.8",unit:"g/dL",status:"high",draws:[{date:"Apr 6",value:12.4},{date:"Apr 9",value:11.8}]},{label:"Ferritin",value:"22",unit:"ng/mL",status:"high"},{label:"TIBC",value:"350",unit:"mcg/dL",status:"high"},{label:"Transferrin Sat",value:"21",unit:"%",status:"high"},{label:"Reticulocytes",value:"1.8",unit:"%",status:"low"},{label:"WBC",value:"6.1",unit:"K/uL",status:"low"},{label:"Platelets",value:"182",unit:"K/uL",status:"low"},{label:"LDH",value:"210",unit:"U/L",status:"low"}],
   conditions:["AML remission","Pre-surgical optimization"],order:"Oral Iron + Monitor CBC pre-op",provider:"Dr. Kim",providerRole:"Hematologist",unit:"Hematology Oncology",admitDate:"Mar 30, 2026",severity:"Mild",carePlanStatus:"pending",aiNote:"Mild anemia in pre-surgical setting. Oral iron and monitoring appropriate.",aiConfidence:79,diagnosis:"Mild Anemia — Pre-surgical Iron Optimization",icdCodes:["D50.9","C91.00"],transfusionHistory:[{date:"None recent"}],allergies:["Penicillin"],medications:["Acyclovir 400mg BID","Ferrous sulfate 325mg BID"]},
  // NO ANEMIA (HGB >13.0) — baseline surveillance
  {id:"TW-1180",name:"Thomas Webb",age:54,dob:"11/03/1971",sex:"Male",weight:"88 kg",bmi:"28.6",npi:"5544332215",domain:"Anemia",caseType:"SPINE",procedureWithin2Weeks:true,redoOrNonIsolated:false,significantComorbidities:false,anticoagulants:false,
   procedure:"Lumbar Laminectomy",
   labs:[{label:"HGB",value:"13.8",unit:"g/dL",status:"low",draws:[{date:"Apr 7",value:13.8}]},{label:"Ferritin",value:"68",unit:"ng/mL",status:"low"},{label:"TIBC",value:"280",unit:"mcg/dL",status:"low"},{label:"Transferrin Sat",value:"31",unit:"%",status:"low"},{label:"Reticulocytes",value:"1.6",unit:"%",status:"low"},{label:"WBC",value:"6.9",unit:"K/uL",status:"low"},{label:"Platelets",value:"262",unit:"K/uL",status:"low"},{label:"Creatinine",value:"0.9",unit:"mg/dL",status:"low"}],
   conditions:["Pre-surgical surveillance","Lumbar stenosis"],order:"Baseline CBC — procedure in 10 days",provider:"Dr. Adams",providerRole:"Attending",unit:"Spine Outpatient",admitDate:"Apr 7, 2026",severity:"No Anemia",carePlanStatus:"generated",aiNote:"No anemia. Baseline surveillance prior to elective spinal procedure.",aiConfidence:96,diagnosis:"No Anemia — Pre-operative Baseline",icdCodes:["Z01.89","M48.06"],transfusionHistory:[{date:"None"}],allergies:["NKDA"],medications:["Aspirin 81mg daily"]},
];
PATIENTS.forEach(p=>{p._trs=calcTRS(p);});

const TRSDrawer=({p,onClose})=>{
  const t=p._trs;const tc=TRC[t.trsSev];
  const riskDesc={"low":"Low transfusion risk. Routine monitoring and optimization is sufficient.","medium":"Moderate risk. Enhanced monitoring and iron optimization recommended.","high":"High risk. Aggressive optimization and preparation required before procedure.","very-high":"Very high risk. Immediate intervention required. Consider delaying elective surgery."}[t.trsSev];
  return(
  <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.5)",backdropFilter:"blur(4px)"}} onClick={onClose}>
    <div style={{width:580,maxHeight:"85vh",background:C.grey[100],borderRadius:16,display:"flex",flexDirection:"column",boxShadow:"0 24px 80px rgba(0,0,0,0.25)",overflow:"hidden"}} onClick={e=>e.stopPropagation()}>

      {/* Header */}
      <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.grey[300]}`,display:"flex",alignItems:"center",gap:12,flexShrink:0,background:C.grey[100]}}>
        <div style={{width:48,height:48,borderRadius:10,background:C.primary[100],display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <TRSGauge value={t.score} trsSev={t.trsSev} size={40}/>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:18,fontWeight:700,color:C.grey[800],fontFamily:font,lineHeight:1.2}}>Transfusion Risk Score</div>
          <div style={{fontSize:14,color:C.grey[600],fontFamily:font,marginTop:2}}>{p.name} · MRN {p.id}</div>
        </div>
        <Button variant="icon" onClick={onClose} aria-label="Close">✕</Button>
      </div>

      {/* Score hero */}
      <div style={{padding:"20px",borderBottom:`1px solid ${C.grey[300]}`,flexShrink:0,background:C.grey[100]}}>
        <div style={{display:"flex",alignItems:"center",gap:20}}>
          <div style={{background:C.grey[200],borderRadius:12,padding:"16px 20px",textAlign:"center",minWidth:100,flexShrink:0}}>
            <div className="tabular-nums-hc1" style={{fontSize:64,fontWeight:500,color:tc,fontFamily:font,lineHeight:1,letterSpacing:"-0.03em"}}>{t.score}</div>
            <div style={{marginTop:6}}><SevChip tier={trsTier(t.trsSev)}/></div>
          </div>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <div style={{height:6,flex:1,background:C.grey[300],borderRadius:999,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${Math.min(t.score/10*100,100)}%`,background:tc,borderRadius:999,transition:"width 0.4s ease"}}/>
              </div>
              <span style={{fontSize:14,fontWeight:600,color:tc,fontFamily:font,flexShrink:0}}>{t.score}/10</span>
            </div>
            <p style={{fontSize:16,color:C.grey[700],fontFamily:font,lineHeight:1.6,margin:0}}>{riskDesc}</p>
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{flex:1,overflowY:"auto",padding:"16px 20px",display:"flex",flexDirection:"column",gap:12,background:C.grey[100]}}>

        {/* Score Breakdown */}
        <div>
          <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.09em",color:C.grey[600],fontFamily:font,marginBottom:8}}>Score Breakdown</div>
          <div style={{background:C.grey[100],borderRadius:10,overflow:"hidden",border:`1px solid ${C.grey[300]}`}}>
            {t.fullBreakdown.map((f,i)=>{
              const sc=f.earnedPts>0;
              return(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderBottom:i<t.fullBreakdown.length-1?`1px solid ${C.grey[300]}`:"none",background:sc?"#fff":C.grey[200]}}>
                  {/* Status indicator */}
                  <div style={{width:20,height:20,borderRadius:6,background:sc?tc:C.grey[300],display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontSize:12,fontWeight:700,color:"#fff"}}>{sc?"✓":"–"}</span>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:16,fontWeight:sc?600:400,color:sc?C.grey[800]:C.grey[500],fontFamily:font}}>{f.label}</div>
                    <div style={{fontSize:14,color:C.grey[500],fontFamily:font,marginTop:1}}>{f.value} · {f.criteria}</div>
                  </div>
                  <div style={{flexShrink:0,textAlign:"right"}}>
                    <span style={{fontSize:16,fontWeight:700,color:sc?tc:C.grey[400],fontFamily:font}}>{sc?`+${f.earnedPts}`:"+0"}</span>
                    <span style={{fontSize:14,color:C.grey[400],fontFamily:font,marginLeft:2}}>/{f.maxPts}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommended Actions */}
        <div>
          <div style={{background:C.grey[200],borderRadius:10,border:`1px solid ${C.grey[300]}`,padding:"14px 16px",marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <span style={{fontSize:18}}>💡</span>
              <span style={{fontSize:16,fontWeight:700,color:C.grey[800],fontFamily:font}}>Recommended Actions</span>
            </div>
            {t.actions.map((a,i)=>(
              <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:i<t.actions.length-1?8:0,fontSize:16,color:C.grey[700],fontFamily:font,lineHeight:1.5}}>
                <span style={{color:C.grey[500],flexShrink:0,marginTop:1}}>·</span>
                {a}
              </div>
            ))}
          </div>
          {/* Evidence — green box */}
          <div style={{background:C.success[100],border:`1px solid rgba(56,128,50,0.2)`,borderRadius:10,padding:"12px 16px"}}>
            <div style={{fontSize:14,color:C.success[400],fontFamily:font,lineHeight:1.6,fontStyle:"italic"}}>
              <strong style={{fontStyle:"normal"}}>Evidence Base:</strong> Transfusion Risk Score validated in cardiac surgery populations (Karkouti et al., Anesthesiology 2006). Predictive accuracy for perioperative transfusion requirement: AUC 0.78–0.82.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);};

const OverviewZone=({p,onNavigate})=>{
  const hgbLab=p.labs[0];
  const draws=hgbLab.draws||[];const hasDelta=draws.length>=2;
  const delta=hasDelta?Math.abs(draws[draws.length-1].value-draws[0].value).toFixed(1):null;
  const isDown=hasDelta&&draws[draws.length-1].value<draws[0].value;
  const trs=p._trs;const tc=TRC[trs.trsSev];
  const hgbColor=getAnemiaGrade(hgbLab.value).color;
  const ferColor=p.labs[1].status==="critical"?C.error[400]:p.labs[1].status==="high"||p.labs[1].status==="borderline"?C.orange[400]:"#92600A";
  const alertBorder=p.severity==="Critical"?C.error[400]:p.severity==="High"?C.orange[400]:"#92600A";
  const alertBg=p.severity==="Critical"?C.error[100]:p.severity==="High"?C.orange[100]:C.yellow[100];
  const protocol=p.severity==="Critical"?"Urgent: IV Iron + Transfusion Evaluation":p.severity==="High"?"IV Iron Therapy Protocol":"Monitoring + Oral Iron Supplementation";
  const drug=p.severity==="Critical"?"Ferric Carboxymaltose 1000mg IV — post stabilization":p.severity==="High"?"Ferric Carboxymaltose 750mg IV — weeks 1 & 3":"Ferrous sulfate 325mg TID — reassess in 4 weeks";
  const recs=p.severity==="Critical"?["Approve IV Iron per AABB guidelines","Restrictive transfusion strategy (Hgb <7 g/dL)","Monitor CBC at 2–4 weeks post-treatment"]:p.severity==="High"?["Initiate IV Iron within 14 days","Recheck Hgb & Ferritin in 7–10 days","Coordinate with surgical team"]:["Continue watchful waiting — CBC q48h","Iron supplementation — oral or IV","Hematology follow-up in 2 weeks"];
  return(
  <div style={{flex:1,overflowY:"auto",padding:"16px 20px",display:"flex",flexDirection:"column",gap:14,minHeight:0}}>

    {/* Card 1: Lab Values */}
    <div style={{background:"#fff",border:`1px solid ${C.grey[300]}`,borderRadius:12,overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
      <div style={{padding:"11px 18px",borderBottom:`1px solid ${C.grey[200]}`,display:"flex",alignItems:"center",gap:7}}>
        <span style={{fontSize:16}}>⚠️</span>
        <span style={{fontSize:16,fontWeight:700,color:C.grey[800],fontFamily:font}}>Risk Assessment</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"130px 150px 140px 1fr"}}>

        {/* HGB */}
        <div style={{padding:"16px 20px",borderRight:`1px solid ${C.grey[200]}`}}>
          <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:C.grey[600],fontFamily:font,marginBottom:8}}>HGB</div>
          <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:6}}>
            <span className="tabular-nums-hc1" style={{fontSize:32,fontWeight:500,color:hgbColor,fontFamily:font,lineHeight:1,letterSpacing:"-0.02em"}}>{hgbLab.value}</span>
            <span style={{fontSize:14,color:C.grey[600],fontFamily:font,fontWeight:500}}>g/dL</span>
          </div>
          {hasDelta&&<div style={{display:"inline-flex",alignItems:"center",gap:3,background:isDown?C.error[100]:C.success[100],borderRadius:4,padding:"2px 7px",marginBottom:6}}>
            <span style={{fontSize:14,fontWeight:700,color:isDown?C.error[400]:C.success[400]}}>{isDown?"↓":"↑"}</span>
            <span style={{fontSize:14,fontWeight:600,color:isDown?C.error[400]:C.success[400],fontFamily:font}}>{delta} g/dL</span>
          </div>}
          {(()=>{const dr=getDeltaRisk(hgbLab.draws);return dr?.isRisk?<div style={{display:"flex",alignItems:"center",gap:3,marginTop:2}}><span className="tabular-nums-hc1" style={{fontSize:12,fontWeight:700,color:C.error[400],background:C.error[100],borderRadius:2,padding:"1px 5px",fontFamily:font,letterSpacing:"0.04em"}}>ΔHb {dr.pct}% ⚠</span></div>:null;})()}
        </div>

        {/* Ferritin */}
        <div style={{padding:"16px 20px",borderRight:`1px solid ${C.grey[200]}`}}>
          <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:C.grey[600],fontFamily:font,marginBottom:8}}>Ferritin</div>
          <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:6}}>
            <span className="tabular-nums-hc1" style={{fontSize:32,fontWeight:500,color:ferColor,fontFamily:font,lineHeight:1,letterSpacing:"-0.02em"}}>{p.labs[1].value}</span>
            <span style={{fontSize:14,color:C.grey[600],fontFamily:font,fontWeight:500}}>ng/mL</span>
          </div>
          <StatusChip status={p.labs[1].status}/>
        </div>

        {/* TRS — gauge only, no numeric */}
        <div style={{padding:"16px 20px",borderRight:`1px solid ${C.grey[200]}`}}>
          <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:C.grey[600],fontFamily:font,marginBottom:8}}>TRS Score</div>
          <TRSGauge value={trs.score} trsSev={trs.trsSev} size={64}/>
          <div style={{marginTop:6}}><SevChip tier={trsTier(trs.trsSev)}/></div>
        </div>

        {/* Active Order */}
        <div style={{padding:"16px 20px"}}>
          <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:C.grey[600],fontFamily:font,marginBottom:8}}>General Advisory</div>
          <div style={{fontSize:16,fontWeight:600,color:C.grey[800],fontFamily:font,lineHeight:1.5}}>{p.order}</div>
        </div>
      </div>
    </div>

    {/* Card 2: AI Alert Protocol — no border, shadow only */}
    <div style={{borderRadius:12,overflow:"hidden",background:"#fff",boxShadow:"0 2px 12px rgba(0,0,0,0.08)"}}>
      <div style={{background:`linear-gradient(135deg,${C.primary[600]},${C.primary[500]},${C.secondary[600]})`,borderBottom:"1px solid rgba(255,255,255,0.08)",padding:"13px 18px",display:"flex",alignItems:"center",gap:10,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,opacity:0.05,backgroundImage:"radial-gradient(rgba(255,255,255,0.9) 1px,transparent 1px)",backgroundSize:"18px 18px",pointerEvents:"none"}}/>
        <div style={{position:"relative",display:"flex",alignItems:"center",gap:10,flex:1}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}>
              <span style={{fontSize:16,color:C.secondary[400]}}>✦</span>
              <span style={{fontSize:16,fontWeight:700,color:"rgba(255,255,255,0.85)",fontFamily:font}}>AI Insight</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",borderBottom:`1px solid ${C.grey[300]}`}}>
        <div style={{padding:"14px 18px",borderRight:`1px solid ${C.grey[300]}`}}>
          <div style={{fontSize:16,color:C.grey[700],fontFamily:font,lineHeight:1.6,marginBottom:14}}>
            {p.severity==="Critical"
              ?`Patient has hemoglobin of ${p.labs[0].value} g/dL with a drop of ${p.labs[0].draws&&p.labs[0].draws.length>=2?Math.abs(p.labs[0].draws[p.labs[0].draws.length-1].value-p.labs[0].draws[0].value).toFixed(1):"—"} g/dL, indicating acute anemia requiring immediate intervention.`
              :p.severity==="High"
              ?`Patient has hemoglobin of ${p.labs[0].value} g/dL with ferritin ${p.labs[1].value} ng/mL, indicating anemia requiring intervention before surgery.`
              :`Patient has hemoglobin of ${p.labs[0].value} g/dL, indicating anemia requiring monitoring and supplementation.`
            }
          </div>
          <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:C.grey[500],fontFamily:font,marginBottom:5}}>Recommended Protocol:</div>
          <div style={{fontSize:16,fontWeight:700,color:C.grey[800],fontFamily:font,marginBottom:3}}>{protocol}</div>
          <div style={{fontSize:14,color:C.grey[600],fontFamily:font}}>{drug}</div>
        </div>
        <div style={{padding:"14px 18px"}}>
          <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",color:C.grey[500],fontFamily:font,marginBottom:8}}>Key Actions</div>
          {recs.map((r,i)=>(
            <div key={i} style={{display:"flex",gap:8,fontSize:14,color:C.grey[700],fontFamily:font,marginBottom:7,lineHeight:1.4,alignItems:"flex-start"}}>
              <div style={{width:17,height:17,borderRadius:"50%",background:C.primary[100],border:`1.5px solid ${C.primary[500]}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                <span style={{fontSize:8,fontWeight:700,color:C.primary[500]}}>{i+1}</span>
              </div>
              {r}
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:"11px 18px",display:"flex",alignItems:"center",justifyContent:"flex-end",background:"#fff"}}>
        <Button variant="cta" onClick={()=>onNavigate("cp")}>
          Review Optimization Recommendations <ArrowRight size={13}/>
        </Button>
      </div>
    </div>

    {/* Card 3: Evidence Base — standalone green card */}
    <div style={{background:C.success[100],border:`0.5px solid rgba(56,128,50,0.2)`,borderRadius:12,padding:"14px 18px"}}>
      <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",color:C.success[400],fontFamily:font,marginBottom:10}}>Evidence Base</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {[{t:"AABB Clinical Practice Guidelines (2020)",d:"Hgb <7 g/dL restrictive transfusion threshold"},{t:"Cochrane Review: IV Iron vs Oral Iron",d:"IV iron superior efficacy, faster Hgb recovery"},{t:"NEJM 2019 — Carson et al.",d:"IV iron reduces transfusion need by 40%"},{t:"ASH Guidelines: Anemia Management",d:"Iron deficiency & chronic disease anemia"}].map(({t,d},i)=>(
          <div key={i} style={{display:"flex",gap:6,alignItems:"flex-start"}}>
            <span style={{fontSize:12,color:C.success[400],flexShrink:0,marginTop:1,fontWeight:700}}>✓</span>
            <div><div style={{fontSize:14,fontWeight:600,color:C.success[400],fontFamily:font}}>{t}</div><div style={{fontSize:12,color:C.grey[600],fontFamily:font,marginTop:1}}>{d}</div></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);};

const EvidenceBox=({refs})=>(
  <div style={{background:C.success[100],border:`0.5px solid rgba(56,128,50,0.25)`,borderRadius:8,padding:"10px 14px",marginBottom:14}}>
    <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",color:C.success[400],fontFamily:font,marginBottom:6}}>Evidence Base</div>
    {refs.map(r=><div key={r} style={{fontSize:14,color:C.success[400],fontFamily:font,marginBottom:2}}>✓ {r}</div>)}
  </div>
);

const StepHeader=({eyebrow,title})=>(
  <div style={{marginBottom:16}}>
    <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:C.secondary[500],fontFamily:font,marginBottom:4}}>{eyebrow}</div>
    <div style={{fontSize:20,fontWeight:700,color:C.grey[800],fontFamily:font}}>{title}</div>
  </div>
);

const CarePlanZone=({p})=>{
  const [step,setStep]=useState(0);
  const [sent,setSent]=useState(false);
  const [attestedDx,setAttestedDx]=useState(p.diagnosis);
  const [clinicalNotes,setClinicalNotes]=useState("");
  const [recipients,setRecipients]=useState({attending:true,surgeon:false,anesthesiologist:false,obgyn:false,infusion:true,patient:true});
  const steps=["Diagnose","Optimization Recommendations","Prior Auth","General Advisory","Notify"];
  const s=p.severity;
  // ── Prior Auth: 5-criteria evaluation per AC3 ──
  const hgbVal=parseFloat(p.labs[0].value);
  const ferLab=p.labs.find(l=>l.label==="Ferritin");
  const ferVal=ferLab?parseFloat(ferLab.value):null;
  const tsatLab=p.labs.find(l=>l.label==="Transferrin Sat");
  const tsatVal=tsatLab?parseFloat(tsatLab.value):null;
  // AC3 Criterion 1: Hemoglobin < 13 g/dL
  const cr1Met=hgbVal<13;
  // AC3 Criterion 2: Ferritin < 100 ng/mL, and/or TSAT < 20%
  const cr2Met=(ferVal!=null&&ferVal<100)||(tsatVal!=null&&tsatVal<20);
  // AC3 Criterion 3: If criteria 1 is met then show criteria 3 as met (peri-operative transfusion risk)
  const cr3Met=cr1Met;
  // AC3 Criterion 4: If criteria 1 and 2 are met then show criteria 4 as met if procedure is in <30 days
  const cr4Met=cr1Met&&cr2Met&&p.procedureWithin2Weeks;
  // AC3 Criterion 5: Qualifying ICD-10 diagnosis codes — at least one primary anemia code and one secondary code
  const PRIMARY_ICD=["D50.0","D50.8","D50.9","D63.0","D63.1","D64.81"];
  const SECONDARY_ICD_PREFIXES=["E83.10","K50.","K51.","K90.0","N18.","N92.","Z98.84","Z91.14"];
  const hasPrimaryICD=p.icdCodes.some(c=>PRIMARY_ICD.includes(c));
  const hasSecondaryICD=p.icdCodes.some(c=>SECONDARY_ICD_PREFIXES.some(pre=>c.startsWith(pre)));
  const cr5Met=hasPrimaryICD&&hasSecondaryICD;
  const criteriaResults=[cr1Met,cr2Met,cr3Met,cr4Met,cr5Met];
  const metCount=criteriaResults.filter(Boolean).length;
  // AC1: Probability = (criteria met / 5) x 100
  const authPct=Math.round((metCount/5)*100);
  // AC2: Color banding — >=80% green (implied), 60–79% orange, <60% red
  const authColor=authPct>=80?C.success[400]:authPct>=60?C.orange[400]:C.error[400];
  const authBg=authPct>=80?C.success[100]:authPct>=60?C.orange[100]:C.error[100];
  const authMsg=authPct>=80?"High likelihood — documentation is strong.":authPct>=60?"Moderate likelihood — address documentation gaps to improve odds.":"Low likelihood — significant gaps to address before submission.";
  // AC6: Dynamic suggestions generated from unmet criteria
  const authSuggestions=[];
  if(!cr1Met) authSuggestions.push({title:"Hemoglobin threshold",desc:"Hemoglobin does not meet the < 13 g/dL threshold for IV iron coverage.",actions:["Document the most recent Hgb value and trend","If Hgb is ≥ 13 g/dL, document clinical justification for IV iron (e.g., anticipated blood loss)","Include pre- and post-operative Hgb trajectory"]});
  if(!cr2Met) authSuggestions.push({title:"Iron studies",desc:"Ferritin and/or TSAT values are not documented or do not meet the < 100 ng/mL / < 20% threshold.",actions:["Order complete iron panel: serum iron, TIBC, transferrin saturation (TSAT)","Document TSAT < 20% if ferritin is borderline","Note inflammatory conditions that may elevate ferritin despite iron deficiency","Consider reticulocyte hemoglobin content (CHr) or zinc protoporphyrin testing"]});
  if(!cr4Met) authSuggestions.push({title:"Route justification",desc:"Need to document why IV route is medically necessary — insufficient time for a 4-week oral iron trial.",actions:["Document failed trial of oral iron (minimum 4–6 weeks with compliance)","Note GI intolerance: nausea, constipation, abdominal pain from oral iron","Document malabsorption conditions: celiac disease, inflammatory bowel disease, gastric bypass","If urgent need, document timeline constraints (upcoming surgery, obstetric deadline)"]});
  if(!cr5Met) authSuggestions.push({title:"Diagnosis codes",desc:"Missing qualifying ICD-10 diagnosis codes — at least one primary anemia code and one secondary code are required.",actions:["Add a primary anemia diagnosis code (D50.0, D50.8, D50.9, D63.0, D63.1, or D64.81)","Add a secondary diagnosis code (e.g., E83.10, K50.x, K51.x, K90.0, N18.x, N92.x, Z98.84, or Z91.14x)","Ensure the underlying condition (e.g., CKD, IBD, menorrhagia) is coded as secondary"]});
  if(authSuggestions.length===0) authSuggestions.push({title:"Documentation complete",desc:"All prior authorization criteria are met. The case is ready for submission.",actions:["Review the attested diagnosis for accuracy","Confirm ICD-10 codes match the clinical documentation","Submit the prior authorization request"]});
  const SC=({i})=>{const d=i<step,a=i===step;return <div onClick={()=>setStep(i)} style={{width:24,height:24,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,flexShrink:0,fontFamily:font,border:`2px solid ${d?C.success[400]:a?C.primary[500]:C.grey[300]}`,background:d?C.success[400]:a?C.primary[500]:"#fff",color:d||a?"#fff":C.grey[500],cursor:"pointer"}}>{d?"✓":i+1}</div>;};
  const hgbDrop=p.labs[0].draws&&p.labs[0].draws.length>=2?Math.abs(p.labs[0].draws[p.labs[0].draws.length-1].value-p.labs[0].draws[0].value).toFixed(1):null;
  const msgPreview=`Subject: New Anemia Optimization Recommendations: ${p.name}\n\nA new evidence-based optimization recommendation has been initiated for ${p.name} (MRN: ${p.id}).\n\nDiagnosis: ${attestedDx}\nTreatment: ${s==="Critical"?"Supportive care + Iron supplement after stabilization":"IV Iron Ferric Carboxymaltose"}\nDosage: ${s==="Critical"?"Ferric Carboxymaltose 750–1000mg IV":"750mg IV × 2 doses"}\n\nPlease review in Epic and coordinate care as needed.\n\n— Anemia Management CDS`;

  return(
  <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
    {/* Stepper — fixed, never scrolls */}
    <div style={{padding:"12px 16px",flexShrink:0}}>
      <div style={{display:"flex",alignItems:"center",background:"#fff",border:`0.5px solid ${C.grey[300]}`,borderRadius:10,padding:"10px 16px"}}>
      {steps.map((lbl,i)=><div key={lbl} style={{display:"flex",alignItems:"center",flex:i<4?1:0,gap:6}}><div style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer"}} onClick={()=>setStep(i)}><SC i={i}/><span style={{fontSize:14,fontWeight:600,fontFamily:font,whiteSpace:"nowrap",color:i<step?C.success[400]:i===step?C.primary[500]:C.grey[500]}}>{lbl}</span></div>{i<4&&<div style={{flex:1,height:2,background:i<step?C.success[400]:C.grey[300],margin:"0 6px"}}/>}</div>)}
      </div>
    </div>

    <div style={{flex:1,overflowY:"auto",padding:"0 16px 16px",minHeight:0}}>
      <div style={{background:"#fff",border:`0.5px solid ${C.grey[300]}`,borderRadius:10,padding:18}}>

      {/* ── STEP 1: DIAGNOSE ── */}
      {step===0&&<div>
        <StepHeader eyebrow="AI Diagnosis & Recommendation" title="Review AI Diagnosis & Treatment"/>

        {/* AI recommendation — dark gradient */}
        <div style={{background:`linear-gradient(135deg,${C.primary[600]},${C.primary[500]},${C.secondary[600]})`,borderRadius:10,padding:16,marginBottom:14,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,opacity:0.05,backgroundImage:"radial-gradient(rgba(255,255,255,0.9) 1px,transparent 1px)",backgroundSize:"18px 18px",pointerEvents:"none"}}/>
          <div style={{position:"relative"}}>
            <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:"rgba(255,255,255,0.5)",fontFamily:font,marginBottom:6}}>AI Diagnosis & Recommendation · {p.aiConfidence}% Confidence</div>
            <div style={{fontSize:18,fontWeight:700,color:"#fff",fontFamily:font,marginBottom:6}}>{p.diagnosis}</div>
            <div style={{fontSize:14,color:"rgba(255,255,255,0.65)",fontFamily:font,lineHeight:1.6,marginBottom:12}}>
              Patient meets criteria: Hgb {p.labs[0].value} g/dL{hgbDrop?` (drop ${hgbDrop} g/dL)`:""}.  Evidence-based protocol per AABB 2020 Transfusion Guidelines.
            </div>
            <div style={{display:"flex",gap:4}}>{p.icdCodes.map(c=><span key={c} style={{fontSize:14,fontWeight:600,color:"rgba(255,255,255,0.85)",background:"rgba(255,255,255,0.12)",border:"0.5px solid rgba(255,255,255,0.2)",borderRadius:4,padding:"2px 7px",fontFamily:font}}>{c}</span>)}</div>
          </div>
        </div>

        {/* Clinical Criteria Met */}
        <div style={{marginBottom:14}}>
          <div style={{fontSize:14,fontWeight:700,color:C.grey[800],fontFamily:font,marginBottom:8}}>Clinical Criteria Met</div>
          <div style={{background:C.grey[200],borderRadius:6,padding:"9px 12px",fontSize:14,color:C.grey[700],fontFamily:font}}>
            Hgb {p.labs[0].value} g/dL{hgbDrop?`, drop ${hgbDrop} g/dL`:""} — currently in 7–9 g/dL range.
          </div>
        </div>

        {/* Evidence Base — consistent green box */}
        <EvidenceBox refs={["AABB 2020 Transfusion Guidelines","Carson (NEJM 2021)"]}/>

        {/* Attested Diagnosis — EDITABLE */}
        <div style={{marginBottom:14}}>
          <div style={{fontSize:14,fontWeight:700,color:C.grey[800],fontFamily:font,marginBottom:6}}>Attested Diagnosis <span style={{fontSize:12,fontWeight:400,color:C.secondary[500]}}>(editable)</span></div>
          <input value={attestedDx} onChange={e=>setAttestedDx(e.target.value)} style={{width:"100%",boxSizing:"border-box",border:`1px solid ${C.grey[300]}`,borderRadius:6,padding:"9px 12px",fontSize:16,fontFamily:font,color:C.grey[800],outline:"none",background:"#fff"}}/>
        </div>

        {/* Clinical Notes */}
        <div style={{marginBottom:16}}>
          <div style={{fontSize:14,fontWeight:700,color:C.grey[800],fontFamily:font,marginBottom:6}}>Clinical Notes <span style={{fontSize:12,fontWeight:400,color:C.grey[500]}}>(optional)</span></div>
          <textarea value={clinicalNotes} onChange={e=>setClinicalNotes(e.target.value)} placeholder="Add any modifications or clinical reasoning..." rows={3} style={{width:"100%",boxSizing:"border-box",border:`1px solid ${C.grey[300]}`,borderRadius:6,padding:"9px 12px",fontSize:14,fontFamily:font,color:C.grey[800],resize:"none",outline:"none"}}/>
        </div>

        <StepActions onNext={()=>setStep(1)} nextLabel="Attest & Generate Optimization Recommendations →"/>
      </div>}

      {/* ── STEP 2: CARE PLAN ── */}
      {step===1&&<div>
        <StepHeader eyebrow="Evidence-Based Optimization Recommendations" title={attestedDx.split("—")[0].trim()}/>

        {/* Treatment Goals */}
        <div style={{background:C.grey[200],borderRadius:8,padding:"10px 14px",marginBottom:14}}>
          <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",color:C.grey[500],fontFamily:font,marginBottom:4}}>Treatment Goals</div>
          <div style={{fontSize:16,color:C.grey[800],fontFamily:font}}>{s==="Critical"?"Hemodynamic stability, Hgb stabilization, identify/treat cause":s==="High"?"Optimize pre-surgical Hgb ≥11 g/dL within 18 days":"Maintain Hgb ≥8.5 g/dL, reduce transfusion exposure"}</div>
        </div>

        {/* Interventions — no color coding, uniform style */}
        <div style={{fontSize:14,fontWeight:700,color:C.grey[800],fontFamily:font,marginBottom:10}}>Interventions</div>
        {[
          {num:"1.",group:"Medication Order",title:s==="Critical"?"Supportive care + Iron supplement after stabilization":"IV Iron infusion",detail:s==="Critical"?"Address underlying cause first, then Ferric Carboxymaltose 750–1000mg IV":"Ferric Carboxymaltose 750mg IV — week 1 & 3"},
          {num:"2.",group:"Monitoring",title:"Lab Monitoring",detail:s==="Critical"?"CBC q6–12h until stable, then daily × 3":"Recheck Hgb + Ferritin in 7–10 days"},
          {num:"3.",group:"Therapeutics",title:"Iron Therapy",detail:s==="Critical"?"Ferric Carboxymaltose 1000mg IV post-stabilization":"Ferrous sulfate 325mg TID if oral tolerated"},
        ].map(({num,group,title,detail})=>(
          <div key={group} style={{background:"#fff",border:`0.5px solid ${C.grey[300]}`,borderLeft:`3px solid ${C.primary[500]}`,borderRadius:"0 8px 8px 0",padding:"10px 14px",marginBottom:8}}>
            <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",color:C.grey[500],fontFamily:font,marginBottom:3}}>{num} {group}</div>
            <div style={{fontSize:16,fontWeight:600,color:C.grey[800],fontFamily:font,marginBottom:2}}>{title}</div>
            <div style={{fontSize:14,color:C.grey[600],fontFamily:font}}>{detail}</div>
          </div>
        ))}

        {/* Evidence Base — consistent green box */}
        <EvidenceBox refs={["AABB 2020 Transfusion Guidelines","Carson (NEJM 2021)"]}/>

        {/* Clinical Review Warning */}
        <div style={{background:C.yellow[100],border:`0.5px solid rgba(255,196,50,0.4)`,borderRadius:8,padding:"10px 14px",marginBottom:16}}>
          <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",color:"#92600A",fontFamily:font,marginBottom:4}}>Clinical Review Required</div>
          <div style={{fontSize:14,color:"#92600A",fontFamily:font,lineHeight:1.5}}>Please review for patient-specific contraindications, drug interactions, and appropriateness before approval.</div>
        </div>

        <StepActions onBack={()=>setStep(0)} onNext={()=>setStep(2)} nextLabel="Check Prior Authorization →"/>
      </div>}

      {/* ── STEP 3: PRIOR AUTH ── */}
      {step===2&&<div>
        {/* AC1: Top label */}
        <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:C.secondary[500],fontFamily:font,marginBottom:4}}>Prior Authorization Analysis</div>
        <div style={{fontSize:20,fontWeight:700,color:C.grey[800],fontFamily:font,marginBottom:16}}>Approval Probability</div>

        {/* AC1 + AC2: Probability display with color banding */}
        <div style={{background:authBg,border:`1px solid ${authColor}40`,borderRadius:10,padding:"18px 20px",marginBottom:14}}>
          <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:6}}>
            <span className="tabular-nums-hc1" style={{fontSize:36,fontWeight:700,color:authColor,fontFamily:font,lineHeight:1}}>{authPct}%</span>
            <span style={{fontSize:14,fontWeight:600,color:authColor,fontFamily:font}}>Probability of Approval</span>
          </div>
          <div style={{marginTop:10,background:"rgba(255,255,255,0.6)",borderRadius:999,height:8,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${authPct}%`,background:authColor,borderRadius:999,transition:"width 0.4s ease"}}/>
          </div>
          <div style={{fontSize:14,color:authColor,fontFamily:font,marginTop:10,lineHeight:1.5}}>{authMsg}</div>
        </div>

        {/* AC3: Criteria Checklist */}
        <div style={{fontSize:14,fontWeight:700,color:C.grey[800],fontFamily:font,marginBottom:8}}>Criteria Met: {metCount}/5</div>
        {[
          {label:"Hemoglobin < 13 g/dL",met:cr1Met},
          {label:"Ferritin < 100 ng/mL, and or TSAT < 20%",met:cr2Met},
          {label:"Clinical indication: peri-operative transfusion risk",met:cr3Met},
          {label:"Elective high blood loss procedure in < 30 days with iron deficiency anemia with insufficient time for an adequate 4-week oral iron trial.",met:cr4Met},
          {label:"Qualifying ICD-10 Diagnosis codes: Primary and Secondary anemia codes are present",met:cr5Met},
        ].map(({label,met},i)=>(
          <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 12px",background:"#fff",border:`0.5px solid ${C.grey[300]}`,borderRadius:6,marginBottom:5}}>
            <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${met?C.success[400]:C.grey[300]}`,background:met?C.success[100]:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
              {met&&<span style={{fontSize:12,color:C.success[400],fontWeight:700}}>✓</span>}
            </div>
            <span style={{fontSize:14,color:met?C.grey[800]:C.grey[500],fontFamily:font,flex:1,lineHeight:1.4}}>{label}</span>
          </div>
        ))}

        {/* AC4: Clinical Evidence Summary */}
        <div style={{marginTop:14,marginBottom:4}}>
          <div style={{fontSize:14,fontWeight:700,color:C.grey[800],fontFamily:font,marginBottom:8}}>Clinical Evidence</div>
          <div style={{background:C.grey[200],borderRadius:8,padding:"10px 14px",marginBottom:14}}>
            <div style={{fontSize:14,color:C.grey[700],fontFamily:font,marginBottom:4}}><strong style={{color:C.grey[800]}}>Hemoglobin:</strong> {p.labs[0].value} g/dL{hgbDrop?` (drop ${hgbDrop} g/dL)`:""}</div>
            <div style={{fontSize:14,color:C.grey[700],fontFamily:font,marginBottom:4}}><strong style={{color:C.grey[800]}}>Ferritin:</strong> {ferLab?`${ferLab.value} ng/mL`:"Not documented"}</div>
            <div style={{fontSize:14,color:C.grey[700],fontFamily:font,marginBottom:4}}><strong style={{color:C.grey[800]}}>TSAT:</strong> {tsatLab?`${tsatLab.value} %`:"Not documented"}</div>
            <div style={{fontSize:14,color:C.grey[700],fontFamily:font,marginBottom:4}}><strong style={{color:C.grey[800]}}>Indication:</strong> {attestedDx}</div>
            <div style={{fontSize:14,color:C.grey[700],fontFamily:font,marginBottom:4}}><strong style={{color:C.grey[800]}}>TRS Score:</strong> {p._trs.score}/10 — {p._trs.category}</div>
            <div style={{fontSize:14,color:C.grey[700],fontFamily:font}}><strong style={{color:C.grey[800]}}>Comorbidities:</strong> {p.conditions.join(", ")}</div>
          </div>
        </div>

        {/* AC5: Diagnosis Codes (ICD-10) */}
        <div style={{marginBottom:14}}>
          <div style={{fontSize:14,fontWeight:700,color:C.grey[800],fontFamily:font,marginBottom:6}}>Diagnosis Codes (ICD-10)</div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{p.icdCodes.map(c=><span key={c} style={{fontSize:14,fontWeight:600,color:C.secondary[600],background:C.secondary[100],border:"0.5px solid rgba(60,166,176,0.2)",borderRadius:4,padding:"2px 7px",fontFamily:font}}>{c}</span>)}</div>
        </div>

        {/* AC6: Suggestions to Improve Approval Odds */}
        <div style={{background:`linear-gradient(135deg,${C.primary[600]},${C.primary[500]},${C.secondary[600]})`,borderRadius:10,overflow:"hidden",marginBottom:14,position:"relative"}}>
          <div style={{position:"absolute",inset:0,opacity:0.05,backgroundImage:"radial-gradient(rgba(255,255,255,0.9) 1px,transparent 1px)",backgroundSize:"18px 18px",pointerEvents:"none"}}/>
          <div style={{position:"relative",padding:"14px 16px"}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
              <span style={{fontSize:16,color:C.secondary[400]}}>✦</span>
              <span style={{fontSize:14,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:"rgba(255,255,255,0.5)",fontFamily:font}}>Suggestions to Improve Authorization Approval</span>
            </div>
            <div style={{fontSize:14,color:"rgba(255,255,255,0.6)",fontFamily:font,marginBottom:12,lineHeight:1.5}}>The following documentation gaps may reduce approval probability. Address these to strengthen your case before submission.</div>
            {authSuggestions.map(({title,desc,actions})=>(
              <div key={title} style={{background:"rgba(255,255,255,0.07)",borderRadius:8,border:"1px solid rgba(255,255,255,0.1)",padding:"12px 14px",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}><span style={{fontSize:14}}>⚠️</span><span style={{fontSize:16,fontWeight:700,color:C.orange[400],fontFamily:font}}>{title}</span></div>
                <div style={{fontSize:14,color:"rgba(255,255,255,0.45)",fontFamily:font,fontStyle:"italic",marginBottom:8}}>{desc}</div>
                <div style={{fontSize:14,fontWeight:700,color:"rgba(255,255,255,0.6)",fontFamily:font,marginBottom:6}}>Recommended Actions:</div>
                {actions.map((a,i)=><div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",fontSize:14,color:"rgba(255,255,255,0.75)",fontFamily:font,marginBottom:5}}><div style={{width:17,height:17,borderRadius:"50%",background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}><span style={{fontSize:8,fontWeight:700,color:"rgba(255,255,255,0.8)",fontFamily:font}}>{i+1}</span></div>{a}</div>)}
              </div>
            ))}
            {/* AC6: Disclaimer */}
            <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",fontFamily:font,fontStyle:"italic",marginTop:10,lineHeight:1.5,paddingTop:10,borderTop:"1px solid rgba(255,255,255,0.08)"}}>This is an estimated approval likelihood only; Refer to the payer's LCD/NCD or prior authorization policy for final coverage determinations.</div>
          </div>
        </div>

        {/* AC7: Evidence Base */}
        <EvidenceBox refs={["Treatment of Iron Deficiency Anemia","Intravenous Iron Therapy"]}/>

        {/* AC8: Step Navigation — ghost back, orange CTA forward */}
        <StepActions onBack={()=>setStep(1)} backGhost={true} onNext={()=>setStep(3)} nextLabel="Proceed to General Advisory →" nextOrange={true}/>
      </div>}

      {/* ── STEP 4: ORDER DEPLOYMENT ── */}
      {step===3&&<div>
        <StepHeader eyebrow="General Advisory · Formulary Approved" title="Review Medication Advisory"/>

        {/* Medication summary — improved visual hierarchy */}
        <div style={{background:C.grey[200],border:`0.5px solid ${C.grey[300]}`,borderRadius:8,padding:14,marginBottom:14}}>
          {/* Drug name + formulary badge */}
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10,marginBottom:10}}>
            <div style={{fontSize:16,fontWeight:700,color:C.grey[800],fontFamily:font}}>Ferric Carboxymaltose (Injectafer)</div>
            <span style={{fontSize:12,fontWeight:700,color:C.success[400],background:C.success[100],border:`1px solid rgba(56,128,50,0.3)`,borderRadius:4,padding:"3px 8px",fontFamily:font,flexShrink:0,whiteSpace:"nowrap"}}>Tier 1 Formulary</span>
          </div>
          {/* Dosing details row */}
          <div style={{fontSize:16,color:C.grey[700],fontFamily:font,marginBottom:10}}>
            {s==="Critical"?"Address underlying cause first, then Ferric Carboxymaltose 750–1000mg IV":"Ferric Carboxymaltose 750mg IV — week 1 & 3"}
          </div>
          {/* Meta row */}
          <div style={{display:"flex",gap:16,paddingTop:10,borderTop:`0.5px solid ${C.grey[300]}`}}>
            <div><div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",color:C.grey[500],fontFamily:font,marginBottom:2}}>RxNorm</div><div style={{fontSize:14,fontWeight:600,color:C.grey[800],fontFamily:font}}>2180278</div></div>
            <div><div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",color:C.grey[500],fontFamily:font,marginBottom:2}}>Route</div><div style={{fontSize:14,fontWeight:600,color:C.grey[800],fontFamily:font}}>Intravenous</div></div>
            <div><div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",color:C.grey[500],fontFamily:font,marginBottom:2}}>Clinical Indication</div><div style={{fontSize:14,fontWeight:600,color:C.grey[800],fontFamily:font}}>{attestedDx.split("—")[0].trim()}</div></div>
          </div>
        </div>

        {/* Safety Checks */}
        <div style={{fontSize:14,fontWeight:700,color:C.grey[800],fontFamily:font,marginBottom:10}}>Safety Checks</div>
        {["Contraindications reviewed","Drug interactions checked","Allergy screening completed","Formulary approved medication","Patient consent documented"].map(label=>(
          <div key={label} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"#fff",border:`0.5px solid ${C.grey[300]}`,borderRadius:6,marginBottom:5}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.success[400]} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><polyline points="20 6 9 17 4 12"/></svg>
            <span style={{fontSize:14,color:C.grey[800],fontFamily:font,flex:1}}>{label}</span>
          </div>
        ))}

        {/* Standing order protocol — consistent green box */}
        <EvidenceBox refs={["SOC-ANEMIA-003 approved by Pharmacy & Therapeutics Committee","Order sent directly to pharmacy upon activation"]}/>

        <StepActions onBack={()=>setStep(2)} onNext={()=>setStep(4)} nextLabel="Activate General Advisory & Send Communication →" nextOrange={true}/>
      </div>}

      {/* ── STEP 5: NOTIFY & SYNC ── */}
      {step===4&&(sent
        ? <div style={{textAlign:"center",padding:"32px 0"}}>
            <div style={{width:60,height:60,borderRadius:"50%",background:C.success[100],border:`2px solid ${C.success[400]}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><CheckCircle size={28} color={C.success[400]}/></div>
            <div style={{fontSize:24,fontWeight:700,color:C.grey[800],fontFamily:font,marginBottom:6}}>Optimization Recommendations Sent Successfully</div>
            <div style={{fontSize:16,color:C.grey[500],fontFamily:font,marginBottom:24}}>All selected recipients have been notified via Epic InBasket & Patient Portal.</div>
            </div>
        : <div>
            <StepHeader eyebrow="Epic InBasket & Patient Portal" title="Communicate Optimization Recommendations"/>

            {/* Recipients */}
            <div style={{fontSize:14,fontWeight:700,color:C.grey[800],fontFamily:font,marginBottom:10}}>Select Recipients</div>
            {[
              {k:"attending",l:"Attending Physician",req:true},
              {k:"surgeon",l:"Surgeon",req:false},
              {k:"anesthesiologist",l:"Anesthesiologist",req:false},
              {k:"obgyn",l:"OB/GYN",req:false},
              {k:"infusion",l:"Infusion Center",req:true},
              {k:"patient",l:"Patient (Portal)",req:true},
            ].map(({k,l,req})=>(
              <div key={k} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:recipients[k]&&req?C.orange[100]:recipients[k]?C.primary[100]:C.grey[100],border:`0.5px solid ${recipients[k]&&req?C.orange[400]+"33":recipients[k]?C.primary[500]+"33":C.grey[300]}`,borderRadius:8,marginBottom:6,cursor:"pointer"}} onClick={()=>setRecipients(r=>({...r,[k]:!r[k]}))}>
                <div style={{width:18,height:18,borderRadius:3,border:`1.5px solid ${recipients[k]?C.primary[500]:C.grey[400]}`,background:recipients[k]?C.primary[500]:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {recipients[k]&&<span style={{fontSize:12,color:"#fff",fontWeight:700}}>✓</span>}
                </div>
                <span style={{fontSize:16,fontWeight:600,color:C.grey[800],fontFamily:font,flex:1}}>{l}</span>
                {req&&<span style={{fontSize:12,fontWeight:700,color:C.orange[400],background:C.orange[100],borderRadius:3,padding:"1px 6px",fontFamily:font}}>Required</span>}
              </div>
            ))}

            {/* Message Preview */}
            <div style={{marginTop:14,marginBottom:14}}>
              <div style={{fontSize:14,fontWeight:700,color:C.grey[800],fontFamily:font,marginBottom:8}}>Message Preview</div>
              <div style={{background:C.grey[200],border:`0.5px solid ${C.grey[300]}`,borderRadius:8,padding:12}}>
                <pre style={{fontSize:14,color:C.grey[700],fontFamily:font,margin:0,whiteSpace:"pre-wrap",lineHeight:1.6}}>{msgPreview}</pre>
              </div>
            </div>

            {/* FHIR note — consistent green box */}
            <EvidenceBox refs={["Delivered via Epic FHIR R4 InBasket API","Patient Portal notification — real-time within Epic"]}/>

            <StepActions onBack={()=>setStep(3)} onNext={()=>setSent(true)} nextLabel="Send to All Selected Recipients →" nextOrange={true}/>
          </div>
      )}
      </div>
    </div>
  </div>
);};

const PatientHeader=({p,onOpenIQ,onOpenCC,onBack})=>{
  const ag=getAnemiaGrade(p.labs[0].value);
  return(
  <div style={{background:"#fff",borderBottom:`1px solid ${C.grey[300]}`,flexShrink:0,padding:"12px 20px",display:"flex",alignItems:"center",gap:16}}>
    <div style={{flex:1,minWidth:0}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
        <span title="Back to Worklist" style={{display:"inline-flex",alignItems:"center",cursor:"pointer",flexShrink:0}} onClick={onBack} onMouseEnter={e=>e.currentTarget.querySelector("svg").style.color=C.primary[500]} onMouseLeave={e=>e.currentTarget.querySelector("svg").style.color=C.grey[500]}><ArrowLeft size={20} color={C.grey[500]} strokeWidth={2} style={{transition:"color 0.15s"}}/></span>
        <span style={{fontSize:20,fontWeight:700,color:C.grey[800],fontFamily:font}}>{p.name}</span>
        <SevChip tier={ag.tier}/>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:8,flexWrap:"wrap"}}>
        <Stethoscope size={11} color={C.grey[500]}/><span style={{fontSize:14,fontWeight:600,color:C.grey[700],fontFamily:font}}>{p.provider}</span>
        <span style={{fontSize:14,color:C.grey[400],margin:"0 2px"}}>·</span>
        <Hash size={11} color={C.grey[500]}/><span style={{fontSize:14,color:C.grey[700],fontFamily:font}}>MRN {p.id}</span>
        <span style={{fontSize:14,color:C.grey[400],margin:"0 2px"}}>·</span>
        <User size={11} color={C.grey[500]}/><span style={{fontSize:14,color:C.grey[700],fontFamily:font}}>Age {p.age} · {p.sex}</span>
        <span style={{fontSize:14,color:C.grey[400],margin:"0 2px"}}>·</span>
        <span style={{fontSize:14,color:C.grey[500],fontFamily:font}}>Domain</span><span style={{fontSize:14,color:C.grey[700],fontFamily:font,marginLeft:3}}>{p.domain}</span>
        <span style={{fontSize:14,color:C.grey[400],margin:"0 2px"}}>·</span>
        <Activity size={11} color={C.grey[500]}/><span style={{fontSize:14,color:C.grey[700],fontFamily:font,marginLeft:3}}>{p.procedure}</span>
      </div>
      <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{p.conditions.map((c,i)=><span key={i} style={{fontSize:14,color:C.grey[600],background:C.grey[200],border:`0.5px solid ${C.grey[300]}`,borderRadius:4,padding:"3px 9px",fontFamily:font}}>{c}</span>)}</div>
    </div>
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      {getPendingCount(p.id)>0&&<div title={`${getPendingCount(p.id)} pending care coordination messages`} onClick={onOpenCC} style={{display:"inline-flex",alignItems:"center",gap:4,background:C.orange[100],color:C.orange[400],border:`1px solid ${C.orange[400]}40`,borderRadius:999,padding:"4px 10px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:font}}><MessageSquare size={12} strokeWidth={2}/>{getPendingCount(p.id)} Pending</div>}
      <Button variant="primary" size="md" onClick={onOpenIQ}
        leftIcon={<span style={{fontSize:14,lineHeight:1}}>✦</span>}>
        IQ Assistant
      </Button>
    </div>
  </div>
);};

const ZoneTabs=({active,onChange,pendingCount})=><div style={{background:C.grey[100],borderBottom:`0.5px solid ${C.grey[300]}`,display:"flex",padding:"0 20px",flexShrink:0}}>{[{id:"overview",label:"Clinical Decision Support",Icon:User},{id:"cp",label:"Optimization Recommendations",Icon:ClipboardList},{id:"cc",label:"Care Coordination",Icon:MessageSquare}].map(({id,label,Icon})=>{const a=active===id;return <div key={id} onClick={()=>onChange(id)} style={{display:"flex",alignItems:"center",gap:6,padding:"10px 16px 9px",borderBottom:a?`2px solid ${C.primary[500]}`:"2px solid transparent",cursor:"pointer",fontSize:16,fontWeight:a?600:400,color:a?C.grey[800]:C.grey[500],fontFamily:font,marginBottom:-1,transition:"all 0.12s",whiteSpace:"nowrap"}}><Icon size={14} strokeWidth={1.5} color={a?C.primary[500]:C.grey[500]}/>{label}{id==="cc"&&pendingCount>0&&<span title={`${pendingCount} pending care coordination messages`} onClick={(e)=>{e.stopPropagation();onChange("cc");}} style={{display:"inline-flex",alignItems:"center",gap:3,background:C.orange[400],color:"#fff",fontSize:11,fontWeight:700,borderRadius:999,padding:"1px 7px",cursor:"pointer",marginLeft:2}}>{pendingCount} Pending</span>}</div>;})}</div>;

const MiniWorklist=({patients,activeId,onSelect,onBack})=>(
  <div style={{width:240,flexShrink:0,background:"#fff",borderRight:`1px solid ${C.grey[300]}`,display:"flex",flexDirection:"column",overflow:"hidden",height:"100%"}}>
    <div onClick={onBack} style={{padding:"10px 16px",borderBottom:`1px solid ${C.grey[300]}`,display:"flex",alignItems:"center",gap:6,cursor:"pointer",minHeight:44}} onMouseEnter={e=>e.currentTarget.style.background=C.grey[200]} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
      <ChevronLeft size={13} strokeWidth={2.5} color={C.grey[500]}/>
      <span style={{fontSize:14,fontWeight:600,color:C.grey[600],fontFamily:font}}>Anemia Worklist</span>
    </div>
    <div style={{flex:1,overflowY:"auto",minHeight:0}}>
      {patients.map(p=>{
        const a=p.id===activeId;
        const cpC=p.carePlanStatus==="generated"?C.success[400]:p.carePlanStatus==="in-progress"?C.orange[400]:C.grey[400];
        return(
          <div key={p.id} onClick={()=>onSelect(p)}
            style={{padding:"12px 16px",borderBottom:`1px solid ${C.grey[300]}`,borderLeft:`3px solid ${a?C.primary[500]:"transparent"}`,background:a?C.primary[100]:"transparent",cursor:"pointer",transition:"background 0.12s"}}
            onMouseEnter={e=>{if(!a)e.currentTarget.style.background=C.grey[200];}}
            onMouseLeave={e=>{if(!a)e.currentTarget.style.background="transparent";}}>
            <div style={{fontSize:16,fontWeight:600,color:a?C.primary[500]:C.grey[800],fontFamily:font,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2}}>{p.name}</div>
            <div style={{fontSize:14,color:C.grey[600],fontFamily:font,marginBottom:6}}>{p.id} · {p.age}y · {p.sex}</div>
            <span style={{fontSize:12,fontWeight:600,color:C.grey[700],background:C.grey[200],border:`0.5px solid ${C.grey[300]}`,borderRadius:4,padding:"1px 6px",fontFamily:font,textTransform:"uppercase",letterSpacing:"0.04em"}}>{p.caseType}</span>
            {p.carePlanStatus!=="pending"&&<div style={{marginTop:5,display:"flex",alignItems:"center",gap:4}}><div style={{width:5,height:5,borderRadius:"50%",background:cpC,flexShrink:0}}/><span style={{fontSize:12,color:cpC,fontFamily:font,fontWeight:600}}>{p.carePlanStatus==="generated"?"CP Generated":"CP In Progress"}</span></div>}
          </div>
        );
      })}
    </div>
  </div>
);

const IQAssistantPanel=({p,onClose,expanded,onToggleExpand})=>{
  const [msg,setMsg]=useState("");
  const [msgs,setMsgs]=useState([{role:"ai",text:`IQ Assistant ready for ${p.name}. Ask about transfusion risk, differential diagnosis, or optimization recommendations.`}]);
  const send=(q)=>{const t=(q||msg).trim();if(!t)return;setMsg("");setMsgs(m=>[...m,{role:"user",text:t}]);setTimeout(()=>{setMsgs(m=>[...m,{role:"ai",text:`Based on ${p.name}'s profile and AABB guidelines — recommended: ${p.order}. ${getAnemiaGrade(p.labs[0].value).label==="Severe"?"Immediate intervention warranted.":"Optimization window remains open."}`}]);},500);};
  const w=expanded?520:340;
  return(
  <div style={{width:w,flexShrink:0,background:"#fff",borderLeft:`1px solid ${C.grey[300]}`,display:"flex",flexDirection:"column",overflow:"hidden",transition:"width 0.2s ease"}}>
    <div style={{padding:"10px 14px",borderBottom:`1px solid ${C.grey[300]}`,display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
      <div style={{width:28,height:28,borderRadius:8,background:`linear-gradient(135deg,${C.primary[600]},${C.secondary[600]})`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <span style={{fontSize:14,color:"#fff",fontWeight:700}}>✦</span>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:16,fontWeight:700,color:C.grey[800],fontFamily:font}}>IQ Assistant</div>
        <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:5,height:5,borderRadius:"50%",background:C.success[400]}}/><span style={{fontSize:12,color:C.grey[500],fontFamily:font}}>Anemia Management · Live</span></div>
      </div>
      <Button variant="icon" onClick={onToggleExpand} aria-label={expanded?"Collapse":"Expand"}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          {expanded?<><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></>:<><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></>}
        </svg>
      </Button>
      <Button variant="icon" onClick={onClose} aria-label="Close">✕</Button>
    </div>
    <div style={{flex:1,overflowY:"auto",padding:"12px 14px",display:"flex",flexDirection:"column",gap:12,background:C.grey[200]}}>
      {msgs.map((m,i)=>(
        <div key={i} style={{display:"flex",flexDirection:"column",alignItems:m.role==="ai"?"flex-start":"flex-end"}}>
          {m.role==="user"
            ?<div style={{background:C.primary[600],color:"#fff",borderRadius:"14px 14px 3px 14px",padding:"8px 12px",fontSize:14,fontFamily:font,maxWidth:"88%",lineHeight:1.5}}>{m.text}</div>
            :<div style={{display:"flex",gap:7,alignItems:"flex-start",width:"100%"}}>
              <div style={{width:22,height:22,borderRadius:6,background:`linear-gradient(135deg,${C.primary[600]},${C.secondary[600]})`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}><span style={{fontSize:12,color:"#fff",fontWeight:700}}>✦</span></div>
              <div style={{background:"#fff",border:`1px solid ${C.grey[300]}`,borderRadius:"3px 14px 14px 14px",padding:"9px 12px",fontSize:14,lineHeight:1.7,fontFamily:font,color:C.grey[800],flex:1}}>{m.text}</div>
            </div>}
        </div>
      ))}
    </div>
    <div style={{padding:"7px 14px 5px",display:"flex",flexWrap:"wrap",gap:5,background:"#fff",borderTop:`1px solid ${C.grey[300]}`}}>
      {["Transfusion risk?","Why IV iron?","Differential?","AABB guidelines?"].map(q=>(
        <Button key={q} variant="ghost" size="xs" onClick={()=>send(q)}>{q}</Button>
      ))}
    </div>
    <div style={{padding:"7px 14px 10px",background:"#fff",display:"flex",gap:7,alignItems:"flex-end"}}>
      <div style={{flex:1,display:"flex",alignItems:"center",background:C.grey[200],borderRadius:10,border:`1px solid ${C.grey[300]}`,overflow:"hidden",padding:"2px 4px 2px 12px"}}>
        <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
          placeholder="Ask about this patient…"
          style={{flex:1,border:"none",background:"transparent",padding:"6px 4px",fontSize:14,outline:"none",fontFamily:font,color:C.grey[800]}}/>
      </div>
      <Button variant="primary" iconOnly onClick={()=>send()} disabled={!msg.trim()} aria-label="Send message">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      </Button>
    </div>
  </div>
);};

const PatientWorkspace=({patient,allPatients,onBack,onSelectPatient,defaultZone="overview"})=>{
  const [zone,setZone]=useState(defaultZone);
  const [iqOpen,setIqOpen]=useState(false);
  const [iqExpanded,setIqExpanded]=useState(false);
  return(
  <div style={{display:"flex",flexDirection:"column",height:"100dvh",fontFamily:font,background:C.grey[200],overflow:"hidden"}}>
    <div style={{height:56,flexShrink:0,background:C.grey[100],borderBottom:`0.5px solid ${C.grey[300]}`,display:"flex",alignItems:"center",padding:"0 24px"}}>
      <span style={{fontSize:16,fontWeight:700,fontFamily:font,flexShrink:0,marginRight:16}}><span style={{color:C.grey[800]}}>hc</span><span style={{color:C.orange[400]}}>1</span><span style={{color:C.grey[800]}}> ClinicalIQ</span></span>
      <div style={{width:"0.5px",height:20,background:C.grey[300],marginRight:16}}/>
      <div style={{display:"flex",alignItems:"center",gap:4,background:C.grey[200],borderRadius:8,padding:4}}>
        {[{label:"Anemia Management",icon:"blood"},{label:"HerCare Co-Pilot",icon:"preg"}].map(({label,icon})=><div key={label} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:6,background:icon==="blood"?C.grey[100]:"transparent",border:icon==="blood"?`0.5px solid ${C.grey[300]}`:"0.5px solid transparent"}}>{icon==="blood"?<BloodDrop size={13} color={C.secondary[500]}/>:<Pregnant size={13} color={C.grey[500]}/>}<span style={{fontSize:14,fontWeight:icon==="blood"?600:400,color:icon==="blood"?C.grey[800]:C.grey[500],fontFamily:font}}>{label}</span></div>)}
      </div>
      <div style={{marginLeft:"auto"}}><BloodHealthAppNav/></div>
    </div>
    <div style={{display:"flex",flex:1,overflow:"hidden"}}>
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
        <PatientHeader p={patient} onOpenIQ={()=>setIqOpen(o=>!o)} onOpenCC={()=>setZone("cc")} onBack={onBack}/>
        <ZoneTabs active={zone} onChange={setZone} pendingCount={getPendingCount(patient.id)}/>
        <div style={{flex:1,display:"flex",overflow:"hidden",minHeight:0}}>
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
            {zone==="overview"&&<OverviewZone p={patient} onNavigate={setZone}/>}
{zone==="cp"&&<CarePlanZone p={patient}/>}
            {zone==="cc"&&<CareCoordination patient={patient}/>}
          </div>
          {iqOpen&&<IQAssistantPanel p={patient} onClose={()=>setIqOpen(false)} expanded={iqExpanded} onToggleExpand={()=>setIqExpanded(e=>!e)}/>}
        </div>
      </div>
    </div>
  </div>
);};

const PatientRow=({p,onOpen})=>{
  const [trsOpen,setTrsOpen]=useState(false);
  const ferC=p.labs[1].status==="critical"?C.error[400]:p.labs[1].status==="high"||p.labs[1].status==="borderline"?C.orange[400]:C.grey[600];
  return <>
    <tr style={{borderBottom:`0.5px solid ${C.grey[300]}`,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background=C.grey[200]} onMouseLeave={e=>e.currentTarget.style.background="transparent"} onClick={()=>onOpen(p,"overview")}>
      <td style={{padding:"12px 16px",minWidth:180}}><span style={{fontSize:16,fontWeight:600,color:C.grey[800],fontFamily:font,display:"block",marginBottom:2}}>{p.name}</span><span className="tabular-nums-hc1" style={{fontSize:14,color:C.grey[500],fontFamily:font,display:"block",marginBottom:5}}>MRN {p.id} · Age {p.age}</span><div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}><span style={{fontSize:12,fontWeight:600,color:C.grey[700],background:C.grey[200],border:`0.5px solid ${C.grey[300]}`,borderRadius:4,padding:"2px 7px",fontFamily:font,letterSpacing:"0.05em",textTransform:"uppercase"}}>{p.caseType}</span>{getPendingCount(p.id)>0&&<span title={`${getPendingCount(p.id)} pending care coordination message${getPendingCount(p.id)===1?"":"s"} for ${p.name}`} onClick={(e)=>{e.stopPropagation();onOpen(p,"cc");}} style={{display:"inline-flex",alignItems:"center",gap:3,background:C.orange[100],color:C.orange[400],border:`1px solid ${C.orange[400]}40`,borderRadius:999,padding:"2px 8px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:font,whiteSpace:"nowrap"}}><MessageSquare size={10} strokeWidth={2}/>{getPendingCount(p.id)} Pending</span>}</div></td>
      <td style={{padding:"12px 16px",minWidth:110}}><span className="tabular-nums-hc1" style={{fontSize:14,fontWeight:500,color:C.grey[700],fontFamily:font}}>{fmtCaseDate(p.admitDate)}</span></td>
      <td style={{padding:"12px 16px",minWidth:190}}>
        <div style={{display:"flex",gap:14}}><div>
          <div style={{fontSize:12,fontWeight:700,color:C.grey[600],textTransform:"uppercase",letterSpacing:"0.07em",fontFamily:font,marginBottom:3}}>HGB</div>
          <div style={{display:"flex",alignItems:"baseline",gap:2}}><span className="tabular-nums-hc1" style={{fontSize:24,fontWeight:500,color:p.labs[0].status==="critical"?C.error[400]:p.labs[0].status==="high"||p.labs[0].status==="borderline"?C.orange[400]:C.grey[600],fontFamily:font,letterSpacing:"-0.01em"}}>{p.labs[0].value}</span><span style={{fontSize:14,color:C.grey[500],fontFamily:font}}>g/dL</span></div>
        </div><div style={{width:"0.5px",background:C.grey[300],alignSelf:"stretch"}}/><div>
          <div style={{fontSize:12,fontWeight:700,color:C.grey[600],textTransform:"uppercase",letterSpacing:"0.07em",fontFamily:font,marginBottom:3}}>Ferritin</div>
          <div style={{display:"flex",alignItems:"baseline",gap:2}}><span className="tabular-nums-hc1" style={{fontSize:24,fontWeight:500,color:ferC,fontFamily:font,letterSpacing:"-0.01em"}}>{p.labs[1].value}</span><span style={{fontSize:14,color:C.grey[500],fontFamily:font}}>ng/mL</span></div>
          <div style={{marginTop:3}}><StatusChip status={p.labs[1].status}/></div>
        </div></div>
      </td>
      <td style={{padding:"12px 16px",minWidth:95}} onClick={e=>{e.stopPropagation();setTrsOpen(v=>!v);}}><div style={{cursor:"pointer",display:"inline-block"}}><TRSGauge value={p._trs.score} trsSev={p._trs.trsSev} size={52}/><div style={{marginTop:3}}><SevChip tier={trsTier(p._trs.trsSev)}/></div></div></td>
      <td style={{padding:"12px 16px",minWidth:180}}><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{p.conditions.map((c,i)=><span key={i} style={{fontSize:14,color:C.grey[700],background:C.grey[200],border:`0.5px solid ${C.grey[300]}`,borderRadius:4,padding:"2px 7px",fontFamily:font}}>{c}</span>)}</div></td>
      <td style={{padding:"12px 16px",minWidth:180}}><span style={{fontSize:14,color:C.grey[700],fontFamily:font,lineHeight:1.4}}>{p.order}</span></td>
      <td style={{padding:"12px 16px",minWidth:110}}><div style={{fontSize:14,fontWeight:600,color:C.grey[800],fontFamily:font}}>{p.provider}</div></td>
      <td style={{padding:"12px 16px",minWidth:100}}>
        {(()=>{
          const ag=getAnemiaGrade(p.labs[0].value);
          const dr=getDeltaRisk(p.labs[0].draws);
          return <div>
            <SevChip tier={ag.tier}/>
            {dr?.isRisk&&<div style={{display:"flex",alignItems:"center",gap:3,marginTop:6}}><span className="tabular-nums-hc1" style={{fontSize:12,fontWeight:700,color:C.error[400],background:C.error[100],borderRadius:2,padding:"1px 4px",fontFamily:font}}>ΔHb {dr.pct}% ⚠</span></div>}
          </div>;
        })()}
      </td>
      <td style={{padding:"12px 16px",minWidth:150}} onClick={e=>e.stopPropagation()}><div style={{display:"flex",alignItems:"center",gap:6}}><Button variant="cta" size="md" onClick={()=>onOpen(p,"cp")} rightIcon={<ArrowRight size={11}/>}>Review Optimization Recommendations</Button>{getPendingCount(p.id)>0&&<div title={`${getPendingCount(p.id)} pending care coordination messages`} onClick={()=>onOpen(p,"cc")} style={{display:"inline-flex",alignItems:"center",gap:4,background:C.orange[100],color:C.orange[400],border:`1px solid ${C.orange[400]}40`,borderRadius:999,padding:"4px 9px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:font,whiteSpace:"nowrap"}}><MessageSquare size={11} strokeWidth={2}/>{getPendingCount(p.id)} Pending</div>}</div></td>
    </tr>
    {trsOpen&&<TRSDrawer p={p} onClose={()=>setTrsOpen(false)}/>}
  </>;
};

export default function App(){
  const [screen,setScreen]=useState("worklist");const [activePatient,setActivePatient]=useState(null);const [defaultZone,setDefaultZone]=useState("overview");
  const [search,setSearch]=useState("");const [ctFilter,setCtFilter]=useState("All Case Types");
  const [,setTick]=useState(0);
  const scrollRef=useRef(null);
  const savedScroll=useRef(0);
  useEffect(()=>{const handler=()=>setTick(t=>t+1);window.addEventListener("storage",handler);window.addEventListener("care-coordination-updated",handler);return ()=>{window.removeEventListener("storage",handler);window.removeEventListener("care-coordination-updated",handler);};},[]);
  useEffect(()=>{if(screen==="worklist"&&scrollRef.current&&savedScroll.current){scrollRef.current.scrollTop=savedScroll.current;}},[screen]);
  if(screen==="workspace"&&activePatient)return <PatientWorkspace patient={activePatient} allPatients={PATIENTS} onBack={()=>setScreen("worklist")} onSelectPatient={p=>setActivePatient(p)} defaultZone={defaultZone}/>;
  const COLS=["PATIENT","CASE DATE","LAB VALUES","TRS","RISK IDENTIFIERS","ACTIVE ORDER","PROVIDER","ANEMIA SEVERITY","ACTIONS"];
  const filtered=PATIENTS.filter(p=>(!search||p.name.toLowerCase().includes(search.toLowerCase())||p.id.toLowerCase().includes(search.toLowerCase())||p.provider.toLowerCase().includes(search.toLowerCase()))&&(ctFilter==="All Case Types"||p.caseType===ctFilter));
  return(
  <div style={{display:"flex",flexDirection:"column",height:"100dvh",fontFamily:font,background:C.grey[200],overflow:"hidden"}}>
    <div style={{height:56,flexShrink:0,background:C.grey[100],borderBottom:`0.5px solid ${C.grey[300]}`,display:"flex",alignItems:"center",padding:"0 24px"}}>
      <span style={{fontSize:16,fontWeight:700,fontFamily:font,marginRight:16}}><span style={{color:C.grey[800]}}>hc</span><span style={{color:C.orange[400]}}>1</span><span style={{color:C.grey[800]}}> ClinicalIQ</span></span>
      <div style={{width:"0.5px",height:20,background:C.grey[300],marginRight:16}}/>
      <div style={{display:"flex",alignItems:"center",gap:4,background:C.grey[200],borderRadius:8,padding:4}}>
        <div style={{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:6,background:C.grey[100],boxShadow:"0 1px 4px rgba(0,0,0,0.08)",border:`0.5px solid ${C.grey[300]}`}}><BloodDrop size={13} color={C.secondary[500]}/><span style={{fontSize:14,fontWeight:600,color:C.grey[800],fontFamily:font}}>Anemia Management</span></div>
        <div style={{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:6,opacity:0.5,cursor:"default"}}><Pregnant size={13} color={C.grey[500]}/><span style={{fontSize:14,fontWeight:400,color:C.grey[500],fontFamily:font}}>HerCare Co-Pilot</span></div>
      </div>
      <div style={{marginLeft:"auto"}}><BloodHealthAppNav/></div>
    </div>
    <div style={{flex:1,overflow:"hidden",padding:"12px 16px",display:"flex",flexDirection:"column",minHeight:0}}>

      <div style={{background:C.grey[100],borderRadius:12,border:`0.5px solid ${C.grey[300]}`,boxShadow:"0 1px 8px rgba(0,0,0,0.06)",overflow:"hidden",display:"flex",flexDirection:"column",flex:1,minHeight:0}}>
        <div style={{padding:"12px 20px",borderBottom:`0.5px solid ${C.grey[300]}`,display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <div style={{position:"relative",width:260}}><Search size={13} color={C.grey[500]} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search patients, MRN, provider..." style={{width:"100%",boxSizing:"border-box",padding:"7px 10px 7px 30px",border:`0.5px solid ${C.grey[300]}`,borderRadius:8,fontSize:14,color:C.grey[800],background:C.grey[100],outline:"none",fontFamily:font}}/></div>
          <div style={{flex:1}}/><Filter size={13} color={C.grey[500]}/><span style={{fontSize:14,color:C.grey[500],fontFamily:font}}>Filter by:</span>
          {[{v:ctFilter,s:setCtFilter,o:CASE_TYPES},{v:"All Severity",s:()=>{},o:["All Severity","Severe","Moderate","Mild","No Anemia"]}].map((dd,i)=><div key={i} style={{position:"relative"}}><select value={dd.v} onChange={e=>dd.s(e.target.value)} style={{appearance:"none",padding:"6px 26px 6px 10px",border:`0.5px solid ${C.grey[300]}`,borderRadius:8,fontSize:14,color:C.grey[700],background:C.grey[100],cursor:"pointer",outline:"none",fontFamily:font}}>{dd.o.map(o=><option key={o}>{o}</option>)}</select><ChevronDown size={10} color={C.grey[500]} style={{position:"absolute",right:7,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/></div>)}
        </div>
        <div ref={scrollRef} style={{flex:1,overflowY:"auto",overflowX:"auto",minHeight:0}}><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr style={{background:C.grey[200],borderBottom:`1px solid ${C.grey[300]}`}}>{COLS.map(h=><th key={h} style={{fontSize:14,fontWeight:700,letterSpacing:"0.06em",color:C.grey[600],textAlign:"left",padding:"10px 16px",textTransform:"uppercase",whiteSpace:"nowrap",fontFamily:font}}>{h}</th>)}</tr></thead><tbody>{filtered.length===0?<tr><td colSpan={COLS.length} style={{padding:24,textAlign:"center",fontSize:16,color:C.grey[500],fontFamily:font}}>No patients match</td></tr>:filtered.map(p=><PatientRow key={p.id} p={p} onOpen={(p,zone="overview")=>{if(scrollRef.current)savedScroll.current=scrollRef.current.scrollTop;setActivePatient(p);setDefaultZone(zone);setScreen("workspace");}}/>)}</tbody></table></div>
        <div style={{padding:"9px 16px",borderTop:`0.5px solid ${C.grey[300]}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:14,color:C.grey[500],fontFamily:font}}>Showing {filtered.length} of {PATIENTS.length} patients</span><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:6,height:6,borderRadius:"50%",background:C.success[400]}}/><span style={{fontSize:14,color:C.success[400],fontFamily:font}}>FHIR R4 Live · Synced 2 min ago</span></div></div>
      </div>
    </div>
  </div>
  );}