/* Clinical data and scoring for the Anemia worklist (moved out of App.jsx unchanged). */
export const fmtCaseDate=(s)=>{const d=new Date(s);if(isNaN(d))return s;const mm=String(d.getMonth()+1).padStart(2,"0");const dd=String(d.getDate()).padStart(2,"0");const yyyy=d.getFullYear();return `${mm}/${dd}/${yyyy}`;};
export const dateInputValue=(s)=>{const d=new Date(s);if(isNaN(d))return "";return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;};
// 4-tier severity chip — SEVERE / MODERATE / MILD / NORMAL — used for TRS, Anemia Grade
// Map TRS trsSev → 4-tier: very-high → severe, high → moderate, medium → mild, low → normal
export const trsTier=(sev)=>sev==="very-high"?"severe":sev==="high"?"moderate":sev==="medium"?"mild":"normal";
// Anemia severity scale for surgical patients — 4 tiers per clinical consensus
// Severe ≤8.0 · Moderate 8.1–11.0 · Mild 11.1–12.9 · No Anemia >13.0
export const getAnemiaGrade=(hgb)=>{const h=parseFloat(hgb);if(h>13.0)return{label:"No Anemia",tier:"normal"};if(h>=11.1)return{label:"Mild",tier:"mild"};if(h>=8.1)return{label:"Moderate",tier:"moderate"};return{label:"Severe",tier:"severe"};};
// Delta-Hb% risk: ≥50% drop from baseline = significantly elevated mortality risk
export const getDeltaRisk=(draws)=>{if(!draws||draws.length<2)return null;const baseline=draws[0].value;const current=draws[draws.length-1].value;if(current>=baseline)return null;const pct=Math.round(((baseline-current)/baseline)*100);return{pct,isRisk:pct>=50};};
export const CASE_TYPES=["All Case Types","CARDIAC","ENT","GASTRO INTESTINAL","GENERAL SURGERY","NEUROSURGERY","ORTHO","PLASTICS/RECONSTRUCTION","SPINE","THORACIC","UROLOGY/GU","VASCULAR","WOMEN'S HEALTH-SURGICAL"];
export const FACILITIES=["hc1 Surgery Center","North Aux Hospital","North Facility"];
export const STATUS_OPTIONS=["Active","Inactive","Completed","Cancelled","Notified"];

export const normSev=(s)=>s==="critical"?"critical":s==="high"||s==="borderline"?"high":"low";
export const LAB_VARIANT={critical:"danger",high:"warning",low:"neutral"};
export const LAB_LABEL={critical:"Critical",high:"High",low:"Low"};
// Map TRS trsSev → StatusChip tier for the hc1 Gauge component
export const TRS_GAUGE_TIER={"very-high":"critical","high":"high","medium":"medium","low":"low"};
export const calcTRS=(p)=>{
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

export const PATIENTS=[
  // SEVERE (HGB ≤8.0) — with >50% ΔHb% risk flag
  {id:"CM-8834",name:"Carlos Medina",facility:"hc1 Surgery Center",age:59,dob:"03/12/1967",sex:"Male",weight:"82 kg",bmi:"27.4",npi:"5544332211",domain:"Anemia",caseType:"GENERAL SURGERY",procedureWithin2Weeks:false,redoOrNonIsolated:true,significantComorbidities:true,anticoagulants:false,caseStatus:"Active",
   procedure:"Laparoscopic Colectomy",
   labs:[{label:"HGB",value:"7.4",unit:"g/dL",status:"critical",draws:[{date:"Apr 4",value:9.8},{date:"Apr 5",value:9.1},{date:"Apr 6",value:8.4},{date:"Apr 8",value:7.9},{date:"Apr 9",value:7.4}]},{label:"Ferritin",value:"8",unit:"ng/mL",status:"critical"},{label:"TIBC",value:"480",unit:"mcg/dL",status:"high"},{label:"Transferrin Sat",value:"4",unit:"%",status:"critical"},{label:"Reticulocytes",value:"0.8",unit:"%",status:"low"},{label:"WBC",value:"14.2",unit:"K/uL",status:"high"},{label:"Platelets",value:"310",unit:"K/uL",status:"low"},{label:"Creatinine",value:"1.4",unit:"mg/dL",status:"high"}],
   conditions:["Post-op Colectomy","T2DM"],order:"Rapid Response – Hgb drop 2.4 g/dL / 24h",provider:"Dr. Nguyen",providerRole:"Attending",unit:"6-South ICU Step-Down",admitDate:"Apr 6, 2026",severity:"Severe",carePlanStatus:"pending",aiNote:"Immediate transfusion threshold review. Hgb trajectory suggests acute blood loss in post-surgical context.",aiConfidence:88,diagnosis:"Acute Anemia — Iron Deficiency with Active Blood Loss",icdCodes:["D62","D50.0","K63.5"],transfusionHistory:[{date:"None recorded"}],allergies:["NKDA"],medications:["Metoprolol 25mg BID","Metformin 1000mg BID","Piperacillin-Tazobactam 3.375g IV q6h"]},
  // MODERATE (HGB 8.1–11.0)
  {id:"DM-5521",name:"Dorothy Marsh",facility:"hc1 Surgery Center",age:72,dob:"08/30/1954",sex:"Female",weight:"67 kg",bmi:"24.1",npi:"5544332212",domain:"Anemia",caseType:"ORTHO",procedureWithin2Weeks:false,redoOrNonIsolated:false,significantComorbidities:true,anticoagulants:false,caseStatus:"Active",
   procedure:"Total Knee Arthroplasty",
   labs:[{label:"HGB",value:"10.1",unit:"g/dL",status:"high",draws:[{date:"Mar 12",value:11.8},{date:"Mar 26",value:10.8},{date:"Apr 2",value:10.1}]},{label:"Ferritin",value:"14",unit:"ng/mL",status:"high"},{label:"TIBC",value:"395",unit:"mcg/dL",status:"high"},{label:"Transferrin Sat",value:"16",unit:"%",status:"high"},{label:"Reticulocytes",value:"1.1",unit:"%",status:"low"},{label:"WBC",value:"7.8",unit:"K/uL",status:"low"},{label:"Platelets",value:"240",unit:"K/uL",status:"low"},{label:"Creatinine",value:"1.9",unit:"mg/dL",status:"high"}],
   conditions:["RA","CKD 3","Anemia of Chronic Disease"],order:"IV Iron optimization – surgery in 18 days",provider:"Dr. Patel",providerRole:"Attending",unit:"Hematology Outpatient",admitDate:"Apr 2, 2026",severity:"Moderate",carePlanStatus:"in-progress",aiNote:"Pre-surgical optimization window is 18 days. IV iron indicated.",aiConfidence:92,diagnosis:"Pre-surgical Iron Deficiency Anemia — Chronic Disease",icdCodes:["D63.1","D50.9","M79.3"],transfusionHistory:[{date:"Feb 2024",product:"2u pRBC"},{date:"Nov 2023",product:"1u pRBC"}],allergies:["Sulfa drugs"],medications:["Methotrexate 15mg weekly","Folic Acid 1mg daily","Lisinopril 10mg daily","Hydroxychloroquine 200mg BID"]},
  // MODERATE — cardiac, recovering
  {id:"JK-2210",name:"James Kowalski",facility:"North Aux Hospital",age:66,dob:"01/14/1960",sex:"Male",weight:"95 kg",bmi:"30.2",npi:"5544332213",domain:"Anemia",caseType:"CARDIAC",procedureWithin2Weeks:false,redoOrNonIsolated:false,significantComorbidities:true,anticoagulants:true,caseStatus:"Active",
   procedure:"Coronary Artery Bypass Graft",
   labs:[{label:"HGB",value:"8.9",unit:"g/dL",status:"high",draws:[{date:"Apr 6",value:7.2},{date:"Apr 9",value:8.9}]},{label:"Ferritin",value:"42",unit:"ng/mL",status:"low"},{label:"TIBC",value:"310",unit:"mcg/dL",status:"low"},{label:"Transferrin Sat",value:"28",unit:"%",status:"low"},{label:"Reticulocytes",value:"2.4",unit:"%",status:"high"},{label:"WBC",value:"8.1",unit:"K/uL",status:"low"},{label:"Platelets",value:"188",unit:"K/uL",status:"low"},{label:"BNP",value:"480",unit:"pg/mL",status:"high"}],
   conditions:["CHF","CKD 2"],order:"Transfusion threshold re-evaluation",provider:"Dr. Singh",providerRole:"Cardiologist",unit:"Cardiology 4-West",admitDate:"Apr 5, 2026",severity:"Moderate",carePlanStatus:"generated",aiNote:"Transfusion response adequate. CHF context suggests conservative threshold.",aiConfidence:85,diagnosis:"Post-transfusion Anemia — Chronic Disease in CHF",icdCodes:["D63.1","I50.32","N18.2"],transfusionHistory:[{date:"Apr 8, 2026",product:"2u pRBC",response:"Hgb +1.7"},{date:"Jan 2026",product:"1u pRBC"}],allergies:["NKDA"],medications:["Furosemide 40mg BID","Carvedilol 12.5mg BID","Spironolactone 25mg daily","Empagliflozin 10mg daily"]},
  // MILD (HGB 11.1–12.9)
  {id:"RP-4401",name:"Rita Patel",facility:"North Aux Hospital",age:81,dob:"05/21/1945",sex:"Female",weight:"58 kg",bmi:"21.3",npi:"5544332214",domain:"Anemia",caseType:"WOMEN'S HEALTH-SURGICAL",procedureWithin2Weeks:true,redoOrNonIsolated:false,significantComorbidities:true,anticoagulants:false,caseStatus:"Active",
   procedure:"Hysterectomy",
   labs:[{label:"HGB",value:"11.8",unit:"g/dL",status:"high",draws:[{date:"Apr 6",value:12.4},{date:"Apr 9",value:11.8}]},{label:"Ferritin",value:"22",unit:"ng/mL",status:"high"},{label:"TIBC",value:"350",unit:"mcg/dL",status:"high"},{label:"Transferrin Sat",value:"21",unit:"%",status:"high"},{label:"Reticulocytes",value:"1.8",unit:"%",status:"low"},{label:"WBC",value:"6.1",unit:"K/uL",status:"low"},{label:"Platelets",value:"182",unit:"K/uL",status:"low"},{label:"LDH",value:"210",unit:"U/L",status:"low"}],
   conditions:["AML remission","Pre-surgical optimization"],order:"Oral Iron + Monitor CBC pre-op",provider:"Dr. Kim",providerRole:"Hematologist",unit:"Hematology Oncology",admitDate:"Mar 30, 2026",severity:"Mild",carePlanStatus:"pending",aiNote:"Mild anemia in pre-surgical setting. Oral iron and monitoring appropriate.",aiConfidence:79,diagnosis:"Mild Anemia — Pre-surgical Iron Optimization",icdCodes:["D50.9","C91.00"],transfusionHistory:[{date:"None recent"}],allergies:["Penicillin"],medications:["Acyclovir 400mg BID","Ferrous sulfate 325mg BID"]},
  // NO ANEMIA (HGB >13.0) — baseline surveillance
  {id:"TW-1180",name:"Thomas Webb",facility:"North Facility",age:54,dob:"11/03/1971",sex:"Male",weight:"88 kg",bmi:"28.6",npi:"5544332215",domain:"Anemia",caseType:"SPINE",procedureWithin2Weeks:true,redoOrNonIsolated:false,significantComorbidities:false,anticoagulants:false,caseStatus:"Active",
   procedure:"Lumbar Laminectomy",
   labs:[{label:"HGB",value:"13.8",unit:"g/dL",status:"low",draws:[{date:"Apr 7",value:13.8}]},{label:"Ferritin",value:"68",unit:"ng/mL",status:"low"},{label:"TIBC",value:"280",unit:"mcg/dL",status:"low"},{label:"Transferrin Sat",value:"31",unit:"%",status:"low"},{label:"Reticulocytes",value:"1.6",unit:"%",status:"low"},{label:"WBC",value:"6.9",unit:"K/uL",status:"low"},{label:"Platelets",value:"262",unit:"K/uL",status:"low"},{label:"Creatinine",value:"0.9",unit:"mg/dL",status:"low"}],
   conditions:["Pre-surgical surveillance","Lumbar stenosis"],order:"Baseline CBC — procedure in 10 days",provider:"Dr. Adams",providerRole:"Attending",unit:"Spine Outpatient",admitDate:"Apr 7, 2026",severity:"No Anemia",carePlanStatus:"generated",aiNote:"No anemia. Baseline surveillance prior to elective spinal procedure.",aiConfidence:96,diagnosis:"No Anemia — Pre-operative Baseline",icdCodes:["Z01.89","M48.06"],transfusionHistory:[{date:"None"}],allergies:["NKDA"],medications:["Aspirin 81mg daily"]},
  // MODERATE — missing weight and ferritin to demonstrate disclaimer logic
  {id:"LF-3301",name:"Linda Foster",facility:"North Facility",age:63,dob:"06/18/1963",sex:"Female",bmi:"—",npi:"5544332216",domain:"Anemia",caseType:"GASTRO INTESTINAL",procedureWithin2Weeks:true,redoOrNonIsolated:false,significantComorbidities:true,anticoagulants:false,caseStatus:"Active",
   procedure:"Small Bowel Resection",
   labs:[{label:"HGB",value:"9.2",unit:"g/dL",status:"high",draws:[{date:"Apr 5",value:10.6},{date:"Apr 9",value:9.2}]},{label:"Ferritin",value:"—",unit:"ng/mL",status:"low",missing:true},{label:"TIBC",value:"410",unit:"mcg/dL",status:"high"},{label:"Transferrin Sat",value:"14",unit:"%",status:"high"},{label:"Reticulocytes",value:"1.3",unit:"%",status:"low"},{label:"WBC",value:"7.1",unit:"K/uL",status:"low"},{label:"Platelets",value:"198",unit:"K/uL",status:"low"},{label:"Creatinine",value:"1.1",unit:"mg/dL",status:"low"}],
   conditions:["Crohn's Disease","Anemia of Chronic Disease"],order:"IV Iron optimization – surgery in 12 days",provider:"Dr. Okafor",providerRole:"Attending",unit:"GI Surgery Outpatient",admitDate:"Apr 9, 2026",severity:"Moderate",carePlanStatus:"pending",aiNote:"Pre-surgical anemia with incomplete iron studies. Weight and ferritin pending — risk score may be underestimated.",aiConfidence:71,diagnosis:"Moderate Anemia — Iron Deficiency with Crohn's Disease",icdCodes:["D50.8","K50.90"],transfusionHistory:[{date:"None recorded"}],allergies:["NKDA"],medications:["Prednisone 20mg daily","Azathioprine 100mg daily","Calcium 600mg daily"]},
];
PATIENTS.forEach(p=>{p._trs=calcTRS(p);});
