// ─── Rich User Profile Types ─────────────────────────────────────────────────
// Mirrors the 13-table psychometric schema — stored as a JSONB blob in Supabase.
// All numeric scores use the range specified per field unless noted otherwise.

export interface UserLogistics {
  current_location_geo: { lat: number; lng: number } | null;
  availability_start_date: string | null;
  remote_preference_score: number;       // 1–10
  travel_willingness_percentage: number; // 0–100
}

export interface EducationRecord {
  institution_type: "University" | "Community College" | "Trade School" | "Conservatory" | "Apprenticeship";
  degree_level_isced: number;            // ISCED-2011 0–8
  field_of_study_isco_category: string;
  program_name: string;
  start_date: string | null;
  completion_date: string | null;
  status: "Complete" | "In Progress" | "Withdrawn";
  academic_score_normalized: number | null; // 0.0–1.0
}

// All Big Five scores: 0–100 (50 = neutral baseline)
export interface PsychometricsBigFive {
  // Openness (7 facets + overall)
  openness_overall: number;
  openness_imagination: number;
  openness_artistic_interests: number;
  openness_emotionality: number;
  openness_adventurousness: number;
  openness_intellect: number;
  openness_liberalism: number;
  // Conscientiousness (6 facets + overall)
  conscientiousness_overall: number;
  conscientiousness_self_efficacy: number;
  conscientiousness_orderliness: number;
  conscientiousness_dutifulness: number;
  conscientiousness_achievement_striving: number;
  conscientiousness_self_discipline: number;
  conscientiousness_cautiousness: number;
  // Extraversion (6 facets + overall)
  extraversion_overall: number;
  extraversion_friendliness: number;
  extraversion_gregariousness: number;
  extraversion_assertiveness: number;
  extraversion_activity_level: number;
  extraversion_excitement_seeking: number;
  extraversion_cheerfulness: number;
  // Agreeableness (6 facets + overall)
  agreeableness_overall: number;
  agreeableness_trust: number;
  agreeableness_morality: number;
  agreeableness_altruism: number;
  agreeableness_cooperation: number;
  agreeableness_modesty: number;
  agreeableness_sympathy: number;
  // Neuroticism (6 facets + overall)
  neuroticism_overall: number;
  neuroticism_anxiety: number;
  neuroticism_anger: number;
  neuroticism_depression: number;
  neuroticism_self_consciousness: number;
  neuroticism_immoderation: number;
  neuroticism_vulnerability: number;
}

// All RIASEC and value scores: 0–100
export interface VocationalInterestsAndValues {
  riasec_realistic: number;
  riasec_investigative: number;
  riasec_artistic: number;
  riasec_social: number;
  riasec_enterprising: number;
  riasec_conventional: number;
  value_achievement: number;
  value_independence: number;
  value_recognition: number;
  value_relationships: number;
  value_support: number;
  value_working_conditions: number;
}

// All universal skill scores: 0–100
export interface UniversalCognitiveAndPhysicalSkills {
  // Cognitive
  cog_critical_thinking: number;
  cog_active_learning: number;
  cog_complex_problem_solving: number;
  cog_spatial_orientation: number;
  cog_memorization: number;
  cog_perceptual_speed: number;
  // Communication
  comm_reading_comprehension: number;
  comm_active_listening: number;
  comm_writing: number;
  comm_speaking: number;
  // Interpersonal
  inter_persuasion: number;
  inter_negotiation: number;
  inter_instruction: number;
  inter_service_orientation: number;
  inter_social_perceptiveness: number;
  // Physical
  phys_manual_dexterity: number;
  phys_finger_dexterity: number;
  phys_multilimb_coordination: number;
  phys_static_strength: number;
  phys_dynamic_strength: number;
  phys_stamina: number;
  // Sensory
  sensory_near_vision: number;
  sensory_far_vision: number;
  sensory_color_discrimination: number;
  sensory_hearing_sensitivity: number;
}

// Domain skill scores: 0–10 per field

export interface DomainSkillsSTEMandIT {
  // Mathematics & Statistics
  math_statistics: number;
  math_calculus: number;
  math_linear_algebra: number;
  math_discrete_math: number;
  // Programming Languages
  prog_python: number;
  prog_javascript_typescript: number;
  prog_java: number;
  prog_c_cpp: number;
  prog_r: number;
  prog_sql: number;
  prog_golang: number;
  prog_rust: number;
  // CS Fundamentals
  cs_data_structures_algorithms: number;
  cs_system_design: number;
  cs_os_fundamentals: number;
  cs_networking: number;
  cs_databases: number;
  // Web & Mobile
  dev_frontend: number;
  dev_backend: number;
  dev_mobile: number;
  dev_cloud_computing: number;
  dev_devops_cicd: number;
  dev_mlops: number;
  // Data & AI
  data_analysis: number;
  data_machine_learning: number;
  data_deep_learning: number;
  data_nlp: number;
  data_computer_vision: number;
  data_engineering: number;
  data_visualisation: number;
  // Engineering Disciplines
  eng_electrical: number;
  eng_mechanical: number;
  eng_civil: number;
  eng_chemical: number;
  eng_biomedical: number;
  // Emerging / Specialised
  spec_cybersecurity: number;
  spec_blockchain: number;
  spec_iot: number;
  spec_robotics: number;
  spec_game_dev: number;
  spec_ar_vr: number;
}

export interface DomainSkillsHealthcareAndSciences {
  health_clinical_medicine: number;
  health_nursing: number;
  health_pharmacy: number;
  health_psychology_clinical: number;
  health_public_health: number;
  health_nutrition: number;
  health_physiotherapy: number;
  health_occupational_therapy: number;
  health_radiography: number;
  health_dentistry: number;
  health_veterinary: number;
  health_biomedical_research: number;
}

export interface DomainSkillsArtsHumanitiesMedia {
  arts_graphic_design: number;
  arts_ui_ux_design: number;
  arts_illustration: number;
  arts_photography: number;
  arts_videography: number;
  arts_video_editing: number;
  arts_music_performance: number;
  arts_music_production: number;
  arts_writing_creative: number;
  arts_writing_journalistic: number;
  arts_acting: number;
  arts_dance: number;
  arts_fashion_design: number;
  arts_fine_arts: number;
  arts_animation: number;
}

export interface DomainSkillsTradesManufacturingLogistics {
  trades_construction: number;
  trades_plumbing: number;
  trades_electrical: number;
  trades_welding: number;
  trades_carpentry: number;
  trades_automotive_mechanics: number;
  trades_cnc_machining: number;
  mfg_quality_control: number;
  mfg_lean_manufacturing: number;
  mfg_equipment_maintenance: number;
  mfg_3d_printing: number;
  log_supply_chain_management: number;
  log_logistics_coordination: number;
  log_warehouse_operations: number;
  log_inventory_management: number;
  log_safety_compliance: number;
  log_forklift_operation: number;
}

export interface DomainSkillsLegalEducationSocial {
  legal_research: number;
  legal_contract_law: number;
  legal_litigation: number;
  legal_compliance: number;
  social_social_work: number;
  social_counseling: number;
  social_community_development: number;
  social_non_profit_management: number;
  social_conflict_resolution: number;
  edu_teaching: number;
  edu_curriculum_development: number;
  edu_special_education: number;
  edu_early_childhood: number;
  gov_policy_analysis: number;
  gov_public_administration: number;
  gov_diplomacy: number;
}

export interface DomainSkillsBusinessAndServices {
  biz_accounting: number;
  biz_financial_analysis: number;
  biz_marketing: number;
  biz_sales: number;
  biz_project_management: number;
  biz_entrepreneurship: number;
  biz_human_resources: number;
  biz_operations_management: number;
  biz_customer_service: number;
}

export interface DomainSkillsSustainabilityAndESG {
  esg_environmental_assessment: number;
  esg_carbon_accounting: number;
  esg_renewable_energy: number;
  esg_circular_economy: number;
  esg_reporting: number;
  esg_green_building: number;
  esg_climate_policy: number;
  esg_biodiversity_conservation: number;
}

// Language proficiency scores: 0–10
export interface DomainSkillsLanguages {
  lang_english: number;
  lang_cantonese: number;
  lang_mandarin: number;
  lang_french: number;
  lang_german: number;
  lang_spanish: number;
  lang_portuguese: number;
  lang_italian: number;
  lang_japanese: number;
  lang_korean: number;
  lang_arabic: number;
  lang_russian: number;
  lang_hindi: number;
  lang_bengali: number;
  lang_urdu: number;
  lang_vietnamese: number;
  lang_thai: number;
  lang_indonesian: number;
  lang_malay: number;
  lang_tagalog: number;
  lang_dutch: number;
  lang_swedish: number;
  lang_norwegian: number;
  lang_danish: number;
  lang_finnish: number;
  lang_polish: number;
  lang_czech: number;
  lang_hungarian: number;
  lang_greek: number;
  lang_turkish: number;
  lang_hebrew: number;
  lang_persian: number;
  lang_swahili: number;
  lang_afrikaans: number;
  lang_punjabi: number;
  lang_gujarati: number;
  lang_tamil: number;
  lang_telugu: number;
  lang_marathi: number;
  lang_sinhalese: number;
}

// ─── Top-level rich profile ───────────────────────────────────────────────────

export interface RichUserProfile {
  User_Logistics_Universal: UserLogistics;
  Education_and_Vocational_Records: EducationRecord[];
  Psychometrics_BigFive: PsychometricsBigFive;
  Vocational_Interests_and_Values: VocationalInterestsAndValues;
  Universal_Cognitive_and_Physical_Skills: UniversalCognitiveAndPhysicalSkills;
  Domain_Skills_STEM_and_IT: DomainSkillsSTEMandIT;
  Domain_Skills_Healthcare_and_Sciences: DomainSkillsHealthcareAndSciences;
  Domain_Skills_Arts_Humanities_Media: DomainSkillsArtsHumanitiesMedia;
  Domain_Skills_Trades_Manufacturing_Logistics: DomainSkillsTradesManufacturingLogistics;
  Domain_Skills_Legal_Education_Social: DomainSkillsLegalEducationSocial;
  Domain_Skills_Business_and_Services: DomainSkillsBusinessAndServices;
  Domain_Skills_Sustainability_and_ESG: DomainSkillsSustainabilityAndESG;
  Domain_Skills_Languages: DomainSkillsLanguages;
}
