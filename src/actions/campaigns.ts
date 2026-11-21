"use server";

import { createClient } from "@/lib/supabase/server";
import { runCampaignAnalysis } from "@/lib/campaigns/calculate-results";
import {
  compareCampaignsOperation,
  createCampaignOperation,
  generateRespondentLinksOperation,
  getCampaignOperation,
  getCampaignResultsOperation,
  getCampaignsOperation,
  getOpenResponsesOperation,
  getRespondentsOperation,
  updateCampaignConfigOperation,
  updateCampaignStatusOperation,
} from "@/lib/campaigns/operations";
import type { ActionResult, Campaign, CampaignResult, Respondent } from "@/types";
import type {
  CreateCampaignInput,
  GenerateLinksInput,
  UpdateCampaignConfigInput,
  UpdateCampaignStatusInput,
} from "@/lib/validations/campaign";

export async function getCampaigns(orgId?: string): Promise<ActionResult<Campaign[]>> {
  return getCampaignsOperation(orgId);
}

export async function getCampaign(id: string): Promise<ActionResult<Campaign>> {
  return getCampaignOperation(id);
}

export async function createCampaign(input: CreateCampaignInput): Promise<ActionResult<Campaign>> {
  return createCampaignOperation(input);
}

export async function updateCampaignConfig(
  input: UpdateCampaignConfigInput
): Promise<ActionResult<Campaign>> {
  return updateCampaignConfigOperation(input);
}

export async function updateCampaignStatus(
  input: UpdateCampaignStatusInput
): Promise<ActionResult<Campaign>> {
  return updateCampaignStatusOperation(input);
}

export async function generateRespondentLinks(
  input: GenerateLinksInput
): Promise<ActionResult<Respondent[]>> {
  return generateRespondentLinksOperation(input);
}

export async function getRespondents(campaignId: string): Promise<ActionResult<Respondent[]>> {
  return getRespondentsOperation(campaignId);
}

export async function getCampaignResults(
  campaignId: string
): Promise<ActionResult<CampaignResult[]>> {
  return getCampaignResultsOperation(campaignId);
}

export async function getOpenResponses(
  campaignId: string
): Promise<ActionResult<{ question_type: string; text: string }[]>> {
  return getOpenResponsesOperation(campaignId);
}

export async function compareCampaigns(
  currentId: string,
  previousId: string
): Promise<
  ActionResult<{
    current: { code: string; name: string; avg: number; fav: number }[];
    previous: { code: string; name: string; avg: number; fav: number }[];
  }>
> {
  return compareCampaignsOperation(currentId, previousId);
}

export async function calculateResults(campaignId: string): Promise<ActionResult<void>> {
  // Authorization: require a session and RLS visibility of the campaign
  // (members of its organization or super_admin) before any service-role work.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No autorizado" };

  const { data: allowed } = await supabase
    .from("campaigns")
    .select("id")
    .eq("id", campaignId)
    .maybeSingle();
  if (!allowed) return { success: false, error: "Campaña no encontrada" };

  return runCampaignAnalysis(campaignId);
}
