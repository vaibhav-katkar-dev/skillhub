import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { useAuthStore, api } from '../store/authStore';
import { getCourseList } from '../data/courseLoader';
import {
  ShieldCheck, BookOpen, FileJson, Upload, CheckCircle,
  AlertCircle, ChevronDown, Loader2, Plus, X,
  ClipboardList, Edit3, RefreshCw, BarChart3, Users,
  Award, Activity, Lock, Database, Eye, Star,
  Trophy, Link2, ExternalLink, Filter, Crown,
  Tag, Trash2, ToggleLeft, ToggleRight, Percent, Mail, Search, Send,
  IndianRupee, Briefcase, TrendingUp, Eye as EyeIcon, EyeOff, BadgeCheck,
  ChevronRight, Globe, Download
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const QUIZ_TEMPLATE = {
  passingScore: 60,
  ribbonTheme: 'blue',
  questions: [
    {
      questionText: 'Your question here?',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctOptionIndex: 0
    }
  ]
};

const AdminPanel = () => {
  const { user, isAuthenticated } = useAuthStore();

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedCourseTitle, setSelectedCourseTitle] = useState('');
  const [quizJson, setQuizJson] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState('');
  const [tab, setTab] = useState('analytics');

  // User Tracker state
  const [trackerUsers, setTrackerUsers] = useState([]);
  const [trackerLoading, setTrackerLoading] = useState(false);
  const [trackerSearch, setTrackerSearch] = useState('');
  const [trackerSelectedUser, setTrackerSelectedUser] = useState(null);
  const [trackerDetails, setTrackerDetails] = useState(null);
  const [trackerDetailsLoading, setTrackerDetailsLoading] = useState(false);
  const [trackerFilterPortfolio, setTrackerFilterPortfolio] = useState(false);
  const [trackerFilterCertified, setTrackerFilterCertified] = useState(false);

  // Hackathon manager state
  const [hacks, setHacks] = useState([]);
  const [hacksLoading, setHacksLoading] = useState(false);
  const [hackForm, setHackForm] = useState({
    title: '', slug: '', tagline: '', description: '', theme: '',
    status: 'upcoming', image: '', tags: '', visible: false, featured: false,
    startDate: '', endDate: '',
    teamMin: 1, teamMax: 4,
    paymentEnabled: false, paymentAmountInr: 0, paymentDescription: 'Hackathon registration fee',
    acceptsDriveLink: true, acceptsPdfLink: true, acceptsAnyLink: false, acceptsGitHubLink: true, acceptsNotionLink: true,
    submissionInstructions: '', maxSubmissionsPerTeam: 3,
    linkLabel: 'Submission Link', linkPlaceholder: 'Paste your submission link here...', linkHint: '',
    rules: '', judgingCriteria: '', prizes: '', faqs: '', accentColor: '#4F46E5',
  });
  const [editingHackId, setEditingHackId] = useState('');
  const [hackSaving, setHackSaving] = useState(false);
  const [hackMsg, setHackMsg] = useState('');
  const [registrationsByHack, setRegistrationsByHack] = useState({});
  const [loadingRegistrationsFor, setLoadingRegistrationsFor] = useState('');
  
  // Winner management state
  const [winnerFormOpen, setWinnerFormOpen] = useState({}); // { [regId]: true/false }
  const [winnerRankInputs, setWinnerRankInputs] = useState({}); // { [regId]: '1st' }
  const [winnerNoteInputs, setWinnerNoteInputs] = useState({}); // { [regId]: 'note' }
  const [winnerSaving, setWinnerSaving] = useState({}); // { [regId]: true/false }
  
  // Host requests state
  const [hostRequests, setHostRequests] = useState([]);
  const [hostRequestsLoading, setHostRequestsLoading] = useState(false);
  const [showHackForm, setShowHackForm] = useState(false);
  
  // Hackathon certificate circulation state
  const [activeCertIssueHackId, setActiveCertIssueHackId] = useState('');
  const [certIssueHackTitle, setCertIssueHackTitle] = useState('');
  const [certIssueForm, setCertIssueForm] = useState({
    certType: 'participation',
    customTitle: 'Certificate of Participation in Hackathon',
    customBody: 'This certificate is proudly awarded to {studentName} for active and valuable participation in the hackathon, demonstrating outstanding creativity, technical problem solving, and collaboration as a member of team "{teamName}".',
    targetMode: 'all',
    selectedTeamIds: []
  });
  const [certIssueSaving, setCertIssueSaving] = useState(false);
  const [certIssueMsg, setCertIssueMsg] = useState('');
  const [certificatesByHack, setCertificatesByHack] = useState({});
  
  const [warmJob, setWarmJob] = useState(null);
  const [warmJobLoading, setWarmJobLoading] = useState(false);
  const [warmJobError, setWarmJobError] = useState('');

  // ── Individual Hackathon Analytics Manager state (managed at frontend) ─────
  const [activeAnalyticsHack, setActiveAnalyticsHack] = useState(null);
  const [hackAnalyticsInputs, setHackAnalyticsInputs] = useState({ totalParticipants: '', totalCertificates: '', totalSubmissions: '' });
  const [hackAnalyticsMsg, setHackAnalyticsMsg] = useState('');
  const [analyticsTick, setAnalyticsTick] = useState(0);

  // ── Coupon manager state ──────────────────────────────────────────
  const [coupons, setCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [couponSaving, setCouponSaving] = useState(false);
  const [couponMsg, setCouponMsg] = useState({ type: '', text: '' });
  const [couponForm, setCouponForm] = useState({
    code: '', discountType: 'percentage', discountValue: '',
    maxUsageLimit: '', validFrom: '', validUntil: '', description: '',
  });
  const [deletingCouponId, setDeletingCouponId] = useState('');
  const [editingCouponId, setEditingCouponId] = useState(''); // coupon._id being edited inline
  const [editCouponForm, setEditCouponForm] = useState({
    discountType: 'percentage', discountValue: '',
    maxUsageLimit: '', validFrom: '', validUntil: '', description: '',
  });
  const [editCouponSaving, setEditCouponSaving] = useState(false);

  // ── Sim Coupon manager state ──────────────────────────────────────────
  const [simCoupons, setSimCoupons] = useState([]);
  const [simCouponsLoading, setSimCouponsLoading] = useState(false);
  const [simCouponSaving, setSimCouponSaving] = useState(false);
  const [simCouponMsg, setSimCouponMsg] = useState({ type: '', text: '' });
  const [simCouponForm, setSimCouponForm] = useState({
    code: '', discountType: 'percentage', discountValue: '',
    simIds: '', maxUsageLimit: '', validFrom: '', validUntil: '', description: '',
  });
  const [deletingSimCouponId, setDeletingSimCouponId] = useState('');
  const [editingSimCouponId, setEditingSimCouponId] = useState(''); 
  const [editSimCouponForm, setEditSimCouponForm] = useState({
    discountType: 'percentage', discountValue: '', simIds: '',
    maxUsageLimit: '', validFrom: '', validUntil: '', description: '',
  });
  const [editSimCouponSaving, setEditSimCouponSaving] = useState(false);

  // ── Course Pricing manager state ─────────────────────────────────
  const [prices, setPrices] = useState([]);          // list from DB
  const [defaultPricePaise, setDefaultPricePaise] = useState(9900);
  const [pricesLoading, setPricesLoading] = useState(false);
  const [priceSaving, setPriceSaving] = useState(''); // courseId being saved
  const [priceMsg, setPriceMsg] = useState({ type: '', text: '' });
  // Local edits: { [courseId]: rupeeString }
  const [priceEdits, setPriceEdits] = useState({});
  // ── Job Simulation Manager state ─────────────────────────────────────────
  const [simulations, setSimulations] = useState([]);
  const [simsLoading, setSimsLoading] = useState(false);
  const [simMsg, setSimMsg] = useState({ type: '', text: '' });
  const [simPriceEdits, setSimPriceEdits] = useState({}); // { [simId]: rupeeString }
  const [simPriceSaving, setSimPriceSaving] = useState(''); // simId being saved
  const [simTogglingId, setSimTogglingId] = useState(''); // simId being toggled
  const [simStatsModal, setSimStatsModal] = useState(null); // null | { simId, data }
  const [simStatsLoading, setSimStatsLoading] = useState(false);

  // ── Email Campaign state ──────────────────────────────────────────
  const [emailUsers, setEmailUsers] = useState([]);
  const [emailUsersLoading, setEmailUsersLoading] = useState(false);
  const [emailSearch, setEmailSearch] = useState('');
  const [selectedEmails, setSelectedEmails] = useState(new Set());
  const [emailForm, setEmailForm] = useState({ subject: '', html: '' });
  const [emailSending, setEmailSending] = useState(false);
  const [emailMsg, setEmailMsg] = useState({ type: '', text: '' });
  const [selectAllUsers, setSelectAllUsers] = useState(false);

  // ── Campus Ambassador Admin state ──────────────────────────────────────────
  const [ambList, setAmbList] = useState([]);
  const [ambListLoading, setAmbListLoading] = useState(false);
  const [ambStatusFilter, setAmbStatusFilter] = useState('');
  const [ambSearch, setAmbSearch] = useState('');
  const [ambActingId, setAmbActingId] = useState('');
  const [ambMsg, setAmbMsg] = useState({ type: '', text: '' });
  const [ambNoteInputs, setAmbNoteInputs] = useState({});
  const [rewardRequests, setRewardRequests] = useState([]);
  const [rewardRequestsLoading, setRewardRequestsLoading] = useState(false);
  const [rewardReqFilter, setRewardReqFilter] = useState('');
  const [rewardActingId, setRewardActingId] = useState('');
  const [rewardNoteInputs, setRewardNoteInputs] = useState({});
  const [rewardMsg, setRewardMsg] = useState({ type: '', text: '' });
  const [ambSubTab, setAmbSubTab] = useState('list');
  const [ambApproveUserId, setAmbApproveUserId] = useState('');
  const [ambApproveMsg, setAmbApproveMsg] = useState({ type: '', text: '' });
  const [ambApproving, setAmbApproving] = useState(false);
  // v2.0 controls
  const [adjustModalAmb, setAdjustModalAmb] = useState(null);
  const [adjustPointsVal, setAdjustPointsVal] = useState('');
  const [adjustReason, setAdjustReason] = useState('');
  const [adjustingPoints, setAdjustingPoints] = useState(false);
  const [historyModalAmb, setHistoryModalAmb] = useState(null);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [exportingReport, setExportingReport] = useState(false);

  useEffect(() => {
    getCourseList().then(setCourses).catch(console.error);
  }, []);

  const loadHacks = async () => {
    setHacksLoading(true);
    try { const r = await api.get('/events/admin/hackathons'); setHacks(r.data); } catch (e) { console.error(e); setHacks([]); }
    finally { setHacksLoading(false); }
  };

  const loadRegistrations = async (hackId) => {
    setLoadingRegistrationsFor(hackId);
    try {
      const r = await api.get(`/events/admin/hackathons/${hackId}/registrations`);
      setRegistrationsByHack((prev) => ({ ...prev, [hackId]: r.data || [] }));
    } catch {
      setRegistrationsByHack((prev) => ({ ...prev, [hackId]: [] }));
    } finally {
      setLoadingRegistrationsFor('');
    }
  };

  const loadCertificates = async (hackId) => {
    try {
      const r = await api.get(`/events/admin/hackathons/${hackId}/certificates`);
      setCertificatesByHack((prev) => ({ ...prev, [hackId]: r.data || [] }));
    } catch {
      setCertificatesByHack((prev) => ({ ...prev, [hackId]: [] }));
    }
  };

  const handleSetWinner = async (hackId, regId, winnerRank, note = '') => {
    setWinnerSaving(prev => ({ ...prev, [regId]: true }));
    try {
      await api.put(`/events/admin/hackathons/${hackId}/registrations/${regId}/winner`, { winnerRank, note });
      // Refresh registrations after updating
      loadRegistrations(hackId);
      // Clear the winner form state for this reg
      setWinnerFormOpen(prev => ({ ...prev, [regId]: false }));
      setWinnerRankInputs(prev => ({ ...prev, [regId]: undefined }));
      setWinnerNoteInputs(prev => ({ ...prev, [regId]: undefined }));
    } catch (err) {
      alert('Failed to set winner: ' + (err.response?.data?.message || err.message));
    } finally {
      setWinnerSaving(prev => ({ ...prev, [regId]: false }));
    }
  };

  const handleRemoveWinner = async (hackId, regId) => {
    if (!window.confirm('Remove winner status from this team?')) return;
    setWinnerSaving(prev => ({ ...prev, [regId]: true }));
    try {
      await api.delete(`/events/admin/hackathons/${hackId}/registrations/${regId}/winner`);
      loadRegistrations(hackId);
      setWinnerFormOpen(prev => ({ ...prev, [regId]: false }));
    } catch (err) {
      alert('Failed to remove winner: ' + (err.response?.data?.message || err.message));
    } finally {
      setWinnerSaving(prev => ({ ...prev, [regId]: false }));
    }
  };

  const handleExportAllUsers = async () => {
    try {
      const response = await api.get('/admin/users/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'skillvalix-users.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
      alert('Failed to export users.');
    }
  };

  const handleExportHackathonUsers = async (hackId) => {
    try {
      const response = await api.get(`/events/admin/hackathons/${hackId}/registrations/export`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `hackathon-${hackId}-registrations.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
      alert('Failed to export hackathon registrations.');
    }
  };

  const loadHostRequests = async () => {
    setHostRequestsLoading(true);
    try { const r = await api.get('/host/admin/all'); setHostRequests(r.data); } catch { setHostRequests([]); }
    finally { setHostRequestsLoading(false); }
  };

  const updateHostRequestStatus = async (id, status) => {
    try {
      await api.put(`/host/admin/${id}/status`, { status });
      loadHostRequests();
    } catch (error) {
      console.error(error);
      alert('Failed to update status');
    }
  };

  const fetchEmailUsers = useCallback(async (search = '') => {
    setEmailUsersLoading(true);
    try {
      const params = new URLSearchParams({ limit: '100' });
      if (search) params.set('search', search);
      const res = await api.get(`/admin/users?${params.toString()}`);
      setEmailUsers(res.data);
    } catch (error) {
      console.error(error);
      setEmailMsg({ type: 'error', text: 'Failed to load users.' });
    } finally {
      setEmailUsersLoading(false);
    }
  }, []);

  const fetchTrackerUsers = useCallback(async (search = '') => {
    setTrackerLoading(true);
    try {
      const params = new URLSearchParams({ limit: '100' });
      if (search) params.set('search', search);
      params.set('hasPortfolio', trackerFilterPortfolio.toString());
      params.set('hasCertificate', trackerFilterCertified.toString());
      const res = await api.get(`/admin/users?${params.toString()}`);
      setTrackerUsers(res.data);
    } catch {
      // ignore
    } finally {
      setTrackerLoading(false);
    }
  }, [trackerFilterPortfolio, trackerFilterCertified]);

  const loadAmbList = useCallback(async (search = '') => {
    setAmbListLoading(true);
    try {
      const params = new URLSearchParams();
      if (ambStatusFilter) params.append('status', ambStatusFilter);
      if (search) params.append('search', search);
      const r = await api.get(`/ambassador/admin/list?${params}`);
      setAmbList(r.data || []);
    } catch {
      setAmbList([]);
    } finally {
      setAmbListLoading(false);
    }
  }, [ambStatusFilter]);

  const loadRewardRequests = useCallback(async () => {
    setRewardRequestsLoading(true);
    try {
      const params = rewardReqFilter ? `?status=${rewardReqFilter}` : '';
      const r = await api.get(`/ambassador/admin/rewards${params}`);
      setRewardRequests(r.data || []);
    } catch {
      setRewardRequests([]);
    } finally {
      setRewardRequestsLoading(false);
    }
  }, [rewardReqFilter]);



  const resetHackForm = () => {
    setHackForm({
      title: '', slug: '', tagline: '', description: '', theme: '',
      status: 'upcoming', image: '', tags: '', visible: false, featured: false,
      startDate: '', endDate: '', registrationDeadline: '', submissionDeadline: '',
      problemStatement: '',
      teamMin: 1, teamMax: 4,
      paymentEnabled: false, paymentAmountInr: 0, paymentDescription: 'Hackathon registration fee',
      acceptsDriveLink: true, acceptsPdfLink: true, acceptsAnyLink: false, acceptsGitHubLink: true, acceptsNotionLink: true,
      submissionInstructions: '', maxSubmissionsPerTeam: 3,
      linkLabel: 'Submission Link', linkPlaceholder: 'Paste your submission link here...', linkHint: '',
      rules: '', judgingCriteria: '', prizes: '', faqs: '', accentColor: '#4F46E5',
    });
    setEditingHackId('');
  };

  const openCertIssuePanel = (hack) => {
    const hackTitle = hack?.title || 'Hackathon';
    setActiveCertIssueHackId(hack._id);
    setCertIssueHackTitle(hackTitle);
    setCertIssueMsg('');
    setCertIssueForm({
      certType: 'participation',
      customTitle: `Certificate of Participation in ${hackTitle}`,
      customBody: `This certificate is proudly awarded to {studentName} for active and valuable participation in ${hackTitle}, demonstrating outstanding creativity, technical problem solving, and collaboration as a member of team "{teamName}".`,
      targetMode: 'all',
      selectedTeamIds: []
    });
    if (!registrationsByHack[hack._id]) {
      loadRegistrations(hack._id);
    }
  };

  const handleIssueCertificates = async (hackId) => {
    setCertIssueSaving(true);
    setCertIssueMsg('');
    try {
      const payload = {
        certType: certIssueForm.certType,
        customTitle: certIssueForm.customTitle,
        customBody: certIssueForm.customBody,
        targetMode: certIssueForm.targetMode,
        teamIds: certIssueForm.selectedTeamIds,
        winnerRankFilter: certIssueForm.winnerRankFilter
      };
      const res = await api.post(`/events/admin/hackathons/${hackId}/issue-certificates`, payload);
      setCertIssueMsg(`✅ Certificates processed: Issued ${res.data.issued}, Skipped ${res.data.skipped} (already issued).`);
      loadHacks();
      if (hackId) loadCertificates(hackId);
    } catch (e) {
      setCertIssueMsg(`❌ Error: ${e.response?.data?.message || 'Failed to issue certificates.'}`);
    } finally {
      setCertIssueSaving(false);
    }
  };

  // ── Hackathon Analytics Calculation & Local Management ─────────────────
  const getHackAnalytics = useCallback((hack, regs = []) => {
    if (!hack) return { totalParticipants: 0, totalCertificates: 0, totalSubmissions: 0, teamsCount: 0, autoWinners: 0, hasOverride: false, dbCertificatesCount: 0, dbParticipationCerts: 0, dbWinnerCerts: 0 };
    const hackId = hack._id || hack.slug;
    const key = `skillvalix_hack_analytics_${hackId}`;
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(key) || '{}'); } catch {}

    const teamsCount = regs.length;
    const autoParticipants = regs.reduce((sum, r) => sum + 1 + (r.members?.length || 0), 0) || (hack.participantCount || 0);
    const autoSubmissions = regs.filter(r => (r.submissions && r.submissions.length > 0) || r.submissionLink || r.submission?.link || r.projectUrl || r.status === 'submitted' || r.status === 'under_review' || r.status === 'approved' || r.status === 'winner').length;
    const autoWinners = regs.filter(r => r.isWinner || r.winnerRank || r.status === 'winner').length;

    // Database certificate counts from backend EventCertificate collection
    const certsFromDb = certificatesByHack[hack._id];
    const dbCertificatesCount = Array.isArray(certsFromDb) ? certsFromDb.length : (Number(hack.certificatesCount) || 0);
    const dbParticipationCerts = Array.isArray(certsFromDb)
      ? certsFromDb.filter(c => c.certType === 'participation').length
      : (Number(hack.participationCertificatesCount) || 0);
    const dbWinnerCerts = Array.isArray(certsFromDb)
      ? certsFromDb.filter(c => c.certType === 'winner').length
      : (Number(hack.winnerCertificatesCount) || 0);

    const autoCertificates = dbCertificatesCount || regs.filter(r => r.certificateIssued || r.hasCertificate || r.certIssued).length;

    const hasOverride = Boolean(
      (saved.totalParticipants !== undefined && saved.totalParticipants !== '') ||
      (saved.totalCertificates !== undefined && saved.totalCertificates !== '') ||
      (saved.totalSubmissions !== undefined && saved.totalSubmissions !== '')
    );

    return {
      teamsCount,
      autoParticipants,
      autoSubmissions,
      autoCertificates,
      autoWinners,
      dbCertificatesCount,
      dbParticipationCerts,
      dbWinnerCerts,
      totalParticipants: saved.totalParticipants !== undefined && saved.totalParticipants !== '' ? Number(saved.totalParticipants) : (autoParticipants || teamsCount),
      totalCertificates: saved.totalCertificates !== undefined && saved.totalCertificates !== '' ? Number(saved.totalCertificates) : autoCertificates,
      totalSubmissions: saved.totalSubmissions !== undefined && saved.totalSubmissions !== '' ? Number(saved.totalSubmissions) : autoSubmissions,
      hasOverride
    };
  }, [analyticsTick, certificatesByHack]);

  const openHackAnalyticsModal = (hack) => {
    setActiveAnalyticsHack(hack);
    const hackId = hack._id || hack.slug;
    const key = `skillvalix_hack_analytics_${hackId}`;
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(key) || '{}'); } catch {}

    setHackAnalyticsInputs({
      totalParticipants: saved.totalParticipants !== undefined ? String(saved.totalParticipants) : '',
      totalCertificates: saved.totalCertificates !== undefined ? String(saved.totalCertificates) : '',
      totalSubmissions: saved.totalSubmissions !== undefined ? String(saved.totalSubmissions) : '',
    });
    setHackAnalyticsMsg('');
    if (!registrationsByHack[hack._id]) {
      loadRegistrations(hack._id);
    }
    if (!certificatesByHack[hack._id]) {
      loadCertificates(hack._id);
    }
  };

  const handleSaveHackAnalyticsOverride = (hackId) => {
    const key = `skillvalix_hack_analytics_${hackId}`;
    const payload = {
      totalParticipants: hackAnalyticsInputs.totalParticipants !== '' ? Number(hackAnalyticsInputs.totalParticipants) : undefined,
      totalCertificates: hackAnalyticsInputs.totalCertificates !== '' ? Number(hackAnalyticsInputs.totalCertificates) : undefined,
      totalSubmissions: hackAnalyticsInputs.totalSubmissions !== '' ? Number(hackAnalyticsInputs.totalSubmissions) : undefined,
    };
    Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);
    
    localStorage.setItem(key, JSON.stringify(payload));
    setHackAnalyticsMsg('✅ Frontend analytics updated & saved locally!');
    setAnalyticsTick(prev => prev + 1);
  };

  const handleResetHackAnalyticsOverride = (hackId) => {
    const key = `skillvalix_hack_analytics_${hackId}`;
    localStorage.removeItem(key);
    setHackAnalyticsInputs({ totalParticipants: '', totalCertificates: '', totalSubmissions: '' });
    setHackAnalyticsMsg('🔄 Analytics reset to system auto-calculated metrics.');
    setAnalyticsTick(prev => prev + 1);
  };

  const loadCoupons = async () => {
    setCouponsLoading(true);
    try { const r = await api.get('/coupons/admin'); setCoupons(r.data || []); }
    catch { setCoupons([]); }
    finally { setCouponsLoading(false); }
  };

  // ── Course Pricing handlers ───────────────────────────────────────
  const loadPrices = async () => {
    setPricesLoading(true);
    try {
      const r = await api.get('/prices/admin/all');
      setPrices(r.data.prices || []);
      setDefaultPricePaise(r.data.defaultPricePaise || 9900);
    } catch { setPrices([]); }
    finally { setPricesLoading(false); }
  };

  const handleSetPrice = async (courseId, courseTitle) => {
    const rupeeStr = priceEdits[courseId];
    const rupees = parseFloat(rupeeStr);
    if (!rupeeStr || isNaN(rupees) || rupees < 1) {
      setPriceMsg({ type: 'error', text: 'Price must be at least ₹1.' });
      return;
    }
    const paiseParsed = Math.round(rupees * 100);
    if (!Number.isInteger(paiseParsed) || paiseParsed < 100) {
      setPriceMsg({ type: 'error', text: 'Invalid price value.' });
      return;
    }
    setPriceSaving(courseId);
    setPriceMsg({ type: '', text: '' });
    try {
      await api.put(`/prices/admin/${courseId}`, { pricePaise: paiseParsed, courseTitle });
      setPriceMsg({ type: 'success', text: `Price for "${courseTitle}" set to ₹${rupees}.` });
      setPriceEdits(prev => { const n = { ...prev }; delete n[courseId]; return n; });
      loadPrices();
    } catch (err) {
      setPriceMsg({ type: 'error', text: err.response?.data?.message || 'Failed to set price.' });
    } finally {
      setPriceSaving('');
    }
  };

  const handleDeletePrice = async (courseId, courseTitle) => {
    if (!window.confirm(`Remove custom price for "${courseTitle}"? It will revert to the default ₹${defaultPricePaise / 100}.`)) return;
    try {
      await api.delete(`/prices/admin/${courseId}`);
      setPriceMsg({ type: 'success', text: `Custom price removed for "${courseTitle}". Using default.` });
      loadPrices();
    } catch (err) {
      setPriceMsg({ type: 'error', text: err.response?.data?.message || 'Failed to remove price.' });
    }
  };

  const handleTogglePrice = async (courseId) => {
    try {
      await api.patch(`/prices/admin/${courseId}/toggle`);
      loadPrices();
    } catch (err) {
      setPriceMsg({ type: 'error', text: err.response?.data?.message || 'Failed to toggle price.' });
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setCouponSaving(true);
    setCouponMsg({ type: '', text: '' });
    try {
      const payload = {
        code: couponForm.code.trim().toUpperCase(),
        discountType: couponForm.discountType,
        discountValue: Number(couponForm.discountValue),
        maxUsageLimit: couponForm.maxUsageLimit ? Number(couponForm.maxUsageLimit) : null,
        validFrom: couponForm.validFrom || null,
        validUntil: couponForm.validUntil || null,
        description: couponForm.description,
      };
      await api.post('/coupons/admin', payload);
      setCouponMsg({ type: 'success', text: `Coupon "${payload.code}" created successfully!` });
      setCouponForm({ code: '', discountType: 'percentage', discountValue: '', maxUsageLimit: '', validFrom: '', validUntil: '', description: '' });
      loadCoupons();
    } catch (err) {
      setCouponMsg({ type: 'error', text: err.response?.data?.message || 'Failed to create coupon.' });
    } finally {
      setCouponSaving(false);
    }
  };

  const handleToggleCoupon = async (id) => {
    try {
      await api.patch(`/coupons/admin/${id}/toggle`);
      loadCoupons();
    } catch (err) {
      setCouponMsg({ type: 'error', text: err.response?.data?.message || 'Failed to toggle coupon.' });
    }
  };

  const handleDeleteCoupon = async (id, code) => {
    if (!window.confirm(`Permanently delete coupon "${code}"? This cannot be undone.`)) return;
    setDeletingCouponId(id);
    try {
      await api.delete(`/coupons/admin/${id}`);
      setCoupons(prev => prev.filter(c => c._id !== id));
      setCouponMsg({ type: 'success', text: `Coupon "${code}" deleted.` });
    } catch { setCouponMsg({ type: 'error', text: 'Failed to delete coupon.' }); }
    finally { setDeletingCouponId(''); }
  };

  const handleStartEditCoupon = (coupon) => {
    setEditingCouponId(coupon._id);
    setEditCouponForm({
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      maxUsageLimit: coupon.maxUsageLimit !== null ? String(coupon.maxUsageLimit) : '',
      validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().slice(0, 16) : '',
      validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().slice(0, 16) : '',
      description: coupon.description || '',
    });
  };

  const handleSaveEditCoupon = async (couponId) => {
    setEditCouponSaving(true);
    setCouponMsg({ type: '', text: '' });
    try {
      const payload = {
        discountType: editCouponForm.discountType,
        discountValue: Number(editCouponForm.discountValue),
        maxUsageLimit: editCouponForm.maxUsageLimit ? Number(editCouponForm.maxUsageLimit) : null,
        validFrom: editCouponForm.validFrom || null,
        validUntil: editCouponForm.validUntil || null,
        description: editCouponForm.description,
      };
      await api.patch(`/coupons/admin/${couponId}`, payload);
      setCouponMsg({ type: 'success', text: 'Coupon updated successfully.' });
      setEditingCouponId('');
      loadCoupons();
    } catch (err) {
      setCouponMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update coupon.' });
    } finally {
      setEditCouponSaving(false);
    }
  };

  const loadSimCoupons = async () => {
    setSimCouponsLoading(true);
    try { const r = await api.get('/events/admin/sim-coupons'); setSimCoupons(r.data || []); }
    catch { setSimCoupons([]); }
    finally { setSimCouponsLoading(false); }
  };

  const handleCreateSimCoupon = async (e) => {
    e.preventDefault();
    setSimCouponSaving(true);
    setSimCouponMsg({ type: '', text: '' });
    try {
      const payload = {
        code: simCouponForm.code.trim().toUpperCase(),
        discountType: simCouponForm.discountType,
        discountValue: Number(simCouponForm.discountValue),
        simIds: simCouponForm.simIds.split(',').map(s => s.trim()).filter(Boolean),
        maxUsageLimit: simCouponForm.maxUsageLimit ? Number(simCouponForm.maxUsageLimit) : null,
        validFrom: simCouponForm.validFrom || null,
        validUntil: simCouponForm.validUntil || null,
        description: simCouponForm.description,
      };
      await api.post('/events/admin/sim-coupons', payload);
      setSimCouponMsg({ type: 'success', text: `Simulation Coupon "${payload.code}" created successfully!` });
      setSimCouponForm({ code: '', discountType: 'percentage', discountValue: '', simIds: '', maxUsageLimit: '', validFrom: '', validUntil: '', description: '' });
      loadSimCoupons();
    } catch (err) {
      setSimCouponMsg({ type: 'error', text: err.response?.data?.message || 'Failed to create sim coupon.' });
    } finally {
      setSimCouponSaving(false);
    }
  };

  const handleToggleSimCoupon = async (id) => {
    try {
      await api.patch(`/events/admin/sim-coupons/${id}/toggle`);
      loadSimCoupons();
    } catch (err) {
      setSimCouponMsg({ type: 'error', text: err.response?.data?.message || 'Failed to toggle sim coupon.' });
    }
  };

  const handleDeleteSimCoupon = async (id, code) => {
    if (!window.confirm(`Permanently delete simulation coupon "${code}"? This cannot be undone.`)) return;
    setDeletingSimCouponId(id);
    try {
      await api.delete(`/events/admin/sim-coupons/${id}`);
      setSimCoupons(prev => prev.filter(c => c._id !== id));
      setSimCouponMsg({ type: 'success', text: `Simulation Coupon "${code}" deleted.` });
    } catch { setSimCouponMsg({ type: 'error', text: 'Failed to delete sim coupon.' }); }
    finally { setDeletingSimCouponId(''); }
  };

  const handleStartEditSimCoupon = (coupon) => {
    setEditingSimCouponId(coupon._id);
    setEditSimCouponForm({
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      simIds: coupon.simIds?.join(', ') || '',
      maxUsageLimit: coupon.maxUsageLimit !== null ? String(coupon.maxUsageLimit) : '',
      validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().slice(0, 16) : '',
      validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().slice(0, 16) : '',
      description: coupon.description || '',
    });
  };

  const handleSaveEditSimCoupon = async (couponId) => {
    setEditSimCouponSaving(true);
    setSimCouponMsg({ type: '', text: '' });
    try {
      const payload = {
        discountType: editSimCouponForm.discountType,
        discountValue: Number(editSimCouponForm.discountValue),
        simIds: editSimCouponForm.simIds.split(',').map(s => s.trim()).filter(Boolean),
        maxUsageLimit: editSimCouponForm.maxUsageLimit ? Number(editSimCouponForm.maxUsageLimit) : null,
        validFrom: editSimCouponForm.validFrom || null,
        validUntil: editSimCouponForm.validUntil || null,
        description: editSimCouponForm.description,
      };
      await api.patch(`/events/admin/sim-coupons/${couponId}`, payload);
      setSimCouponMsg({ type: 'success', text: 'Sim Coupon updated successfully.' });
      setEditingSimCouponId('');
      loadSimCoupons();
    } catch (err) {
      setSimCouponMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update sim coupon.' });
    } finally {
      setEditSimCouponSaving(false);
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (selectedEmails.size === 0 && !selectAllUsers) {
      setEmailMsg({ type: 'error', text: 'Please select at least one user or choose "Select All".' });
      return;
    }
    
    setEmailSending(true);
    setEmailMsg({ type: '', text: '' });
    
    try {
      const payload = {
        subject: emailForm.subject,
        html: emailForm.html,
        target: selectAllUsers ? 'all' : 'selected',
        userIds: Array.from(selectedEmails)
      };
      
      const res = await api.post('/admin/send-email', payload);
      setEmailMsg({ type: 'success', text: res.data.message || 'Emails queued successfully.' });
      setEmailForm({ subject: '', html: '' });
      setSelectedEmails(new Set());
      setSelectAllUsers(false);
    } catch (err) {
      setEmailMsg({ type: 'error', text: err.response?.data?.message || 'Failed to send emails.' });
    } finally {
      setEmailSending(false);
    }
  };

  const toggleEmailSelection = (userId) => {
    const newSet = new Set(selectedEmails);
    if (newSet.has(userId)) newSet.delete(userId);
    else newSet.add(userId);
    setSelectedEmails(newSet);
  };

  useEffect(() => {
    if (tab === 'hackathons') loadHacks();
    if (tab === 'host-requests') loadHostRequests();
    if (tab === 'coupons') loadCoupons();
    if (tab === 'sim-coupons') loadSimCoupons();
    if (tab === 'pricing') loadPrices();
    if (tab === 'simulations') loadSimulations();
    if (tab === 'users') {
      setTrackerSearch('');
      fetchTrackerUsers('');
    }
    if (tab === 'email') {
      // Reset stale state when entering the email tab
      setEmailMsg({ type: '', text: '' });
      setEmailSearch('');
      setSelectedEmails(new Set());
      setSelectAllUsers(false);
      fetchEmailUsers('');
    }
  }, [tab, fetchTrackerUsers, fetchEmailUsers]);

  // ── Simulation Manager handlers ───────────────────────────────────────────
  const loadSimulations = async () => {
    setSimsLoading(true);
    setSimMsg({ type: '', text: '' });
    try {
      const r = await api.get('/events/admin/simulations');
      setSimulations(r.data || []);
    } catch {
      setSimulations([]);
      setSimMsg({ type: 'error', text: 'Failed to load simulations.' });
    } finally {
      setSimsLoading(false);
    }
  };

  const handleSimPriceSave = async (simId, title) => {
    const rupeeStr = simPriceEdits[simId];
    const rupees = parseFloat(rupeeStr);
    if (!rupeeStr || isNaN(rupees) || rupees < 1) {
      setSimMsg({ type: 'error', text: 'Price must be at least ₹1.' });
      return;
    }
    setSimPriceSaving(simId);
    setSimMsg({ type: '', text: '' });
    try {
      await api.put(`/events/admin/simulations/${simId}/price`, { certCost: Math.round(rupees) });
      setSimMsg({ type: 'success', text: `Price for "${title}" updated to ₹${Math.round(rupees)}.` });
      setSimPriceEdits(prev => { const n = { ...prev }; delete n[simId]; return n; });
      loadSimulations();
    } catch (err) {
      setSimMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update price.' });
    } finally {
      setSimPriceSaving('');
    }
  };

  const handleSimToggleVisibility = async (simId) => {
    setSimTogglingId(simId);
    setSimMsg({ type: '', text: '' });
    try {
      const r = await api.patch(`/events/admin/simulations/${simId}/toggle-visibility`);
      setSimMsg({ type: 'success', text: r.data.message });
      loadSimulations();
    } catch (err) {
      setSimMsg({ type: 'error', text: err.response?.data?.message || 'Failed to toggle visibility.' });
    } finally {
      setSimTogglingId('');
    }
  };

  const handleViewSimStats = async (simId) => {
    setSimStatsModal({ simId, data: null });
    setSimStatsLoading(true);
    try {
      const r = await api.get(`/events/admin/simulations/${simId}/stats`);
      setSimStatsModal({ simId, data: r.data });
    } catch {
      setSimStatsModal(null);
      setSimMsg({ type: 'error', text: 'Failed to load simulation stats.' });
    } finally {
      setSimStatsLoading(false);
    }
  };

  const handleViewTrackerDetails = async (user) => {
    setTrackerSelectedUser(user);
    setTrackerDetailsLoading(true);
    setTrackerDetails(null);
    try {
      const res = await api.get(`/admin/users/${user._id}/details`);
      setTrackerDetails(res.data);
    } catch {
      // ignore
    } finally {
      setTrackerDetailsLoading(false);
    }
  };

  // ── Campus Ambassador admin handlers ─────────────────────────────────────────
  const handleAmbApprove = async (ambassadorId) => {
    setAmbActingId(ambassadorId);
    setAmbMsg({ type: '', text: '' });
    try {
      const r = await api.post('/ambassador/admin/approve', { ambassadorId, adminNote: ambNoteInputs[ambassadorId] || '' });
      setAmbMsg({ type: 'success', text: r.data.message });
      loadAmbList(ambSearch);
    } catch (err) {
      setAmbMsg({ type: 'error', text: err.response?.data?.message || 'Failed to approve.' });
    } finally {
      setAmbActingId('');
    }
  };

  const handleAmbReject = async (ambassadorId) => {
    setAmbActingId(ambassadorId);
    setAmbMsg({ type: '', text: '' });
    try {
      const r = await api.post('/ambassador/admin/reject', { ambassadorId, adminNote: ambNoteInputs[ambassadorId] || '' });
      setAmbMsg({ type: 'success', text: r.data.message });
      loadAmbList(ambSearch);
    } catch (err) {
      setAmbMsg({ type: 'error', text: err.response?.data?.message || 'Failed to reject.' });
    } finally {
      setAmbActingId('');
    }
  };

  const handleAmbSuspend = async (id) => {
    setAmbActingId(id);
    try {
      const r = await api.post(`/ambassador/admin/suspend/${id}`);
      setAmbMsg({ type: 'success', text: r.data.message });
      loadAmbList(ambSearch);
    } catch (err) {
      setAmbMsg({ type: 'error', text: err.response?.data?.message || 'Failed to suspend.' });
    } finally {
      setAmbActingId('');
    }
  };

  const handleAmbReactivate = async (id) => {
    setAmbActingId(id);
    try {
      const r = await api.post(`/ambassador/admin/reactivate/${id}`);
      setAmbMsg({ type: 'success', text: r.data.message });
      loadAmbList(ambSearch);
    } catch (err) {
      setAmbMsg({ type: 'error', text: err.response?.data?.message || 'Failed to reactivate.' });
    } finally {
      setAmbActingId('');
    }
  };

  const handleRewardApprove = async (reqId) => {
    setRewardActingId(reqId);
    setRewardMsg({ type: '', text: '' });
    try {
      const r = await api.post(`/ambassador/admin/rewards/${reqId}/approve`, { adminNote: rewardNoteInputs[reqId] || '' });
      setRewardMsg({ type: 'success', text: r.data.message });
      loadRewardRequests();
    } catch (err) {
      setRewardMsg({ type: 'error', text: err.response?.data?.message || 'Failed to approve reward.' });
    } finally {
      setRewardActingId('');
    }
  };

  const handleRewardReject = async (reqId) => {
    setRewardActingId(reqId);
    setRewardMsg({ type: '', text: '' });
    try {
      const r = await api.post(`/ambassador/admin/rewards/${reqId}/reject`, { adminNote: rewardNoteInputs[reqId] || '' });
      setRewardMsg({ type: 'success', text: r.data.message });
      loadRewardRequests();
    } catch (err) {
      setRewardMsg({ type: 'error', text: err.response?.data?.message || 'Failed to reject reward.' });
    } finally {
      setRewardActingId('');
    }
  };

  const handleAdjustPointsSubmit = async (e) => {
    e.preventDefault();
    if (!adjustModalAmb || !adjustPointsVal || !adjustReason.trim()) {
      setAmbMsg({ type: 'error', text: 'Points value and a mandatory reason are required.' });
      return;
    }
    setAdjustingPoints(true);
    try {
      const r = await api.post('/ambassador/admin/adjust-points', {
        ambassadorId: adjustModalAmb._id,
        points: Number(adjustPointsVal),
        reason: adjustReason.trim(),
      });
      setAmbMsg({ type: 'success', text: r.data.message });
      setAdjustModalAmb(null);
      setAdjustPointsVal('');
      setAdjustReason('');
      loadAmbList(ambSearch);
    } catch (err) {
      setAmbMsg({ type: 'error', text: err.response?.data?.message || 'Failed to adjust points.' });
    } finally {
      setAdjustingPoints(false);
    }
  };

  const handleOverrideLevel = async (ambassadorId, levelOverride) => {
    try {
      const r = await api.post('/ambassador/admin/override-level', { ambassadorId, levelOverride });
      setAmbMsg({ type: 'success', text: r.data.message });
      loadAmbList(ambSearch);
    } catch (err) {
      setAmbMsg({ type: 'error', text: err.response?.data?.message || 'Failed to override level.' });
    }
  };

  const handleOverrideRevShare = async (ambassadorId, customRevenueShare) => {
    try {
      const r = await api.post('/ambassador/admin/override-revshare', { ambassadorId, customRevenueShare });
      setAmbMsg({ type: 'success', text: r.data.message });
      loadAmbList(ambSearch);
    } catch (err) {
      setAmbMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update revenue share.' });
    }
  };

  const handleUpdateRewardStatus = async (reqId, status) => {
    setRewardActingId(reqId);
    setRewardMsg({ type: '', text: '' });
    try {
      const r = await api.post(`/ambassador/admin/rewards/${reqId}/status`, {
        status,
        adminNote: rewardNoteInputs[reqId] || '',
      });
      setRewardMsg({ type: 'success', text: r.data.message });
      loadRewardRequests();
    } catch (err) {
      setRewardMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update reward status.' });
    } finally {
      setRewardActingId('');
    }
  };

  const handleViewHistory = async (amb) => {
    setHistoryModalAmb(amb);
    setLoadingHistory(true);
    try {
      const r = await api.get(`/ambassador/admin/point-history/${amb._id}`);
      setHistoryLogs(r.data);
    } catch (err) {
      console.error(err);
      setHistoryLogs([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleExportReport = async () => {
    setExportingReport(true);
    try {
      const r = await api.get('/ambassador/admin/export-report');
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(r.data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `SkillValix-Ambassadors-Report-${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setAmbMsg({ type: 'success', text: 'Ambassador report exported successfully!' });
    } catch (err) {
      setAmbMsg({ type: 'error', text: 'Failed to export report.' });
    } finally {
      setExportingReport(false);
    }
  };

  const handleAmbAssignByUserId = async () => {
    if (!ambApproveUserId.trim()) {
      setAmbApproveMsg({ type: 'error', text: 'Enter a user ID.' });
      return;
    }
    setAmbApproving(true);
    setAmbApproveMsg({ type: '', text: '' });
    try {
      const r = await api.post('/ambassador/admin/approve', { userId: ambApproveUserId.trim() });
      setAmbApproveMsg({ type: 'success', text: `${r.data.message} — Referral code: ${r.data.referralCode}` });
      setAmbApproveUserId('');
      loadAmbList(ambSearch);
    } catch (err) {
      setAmbApproveMsg({ type: 'error', text: err.response?.data?.message || 'Failed to assign ambassador.' });
    } finally {
      setAmbApproving(false);
    }
  };

  useEffect(() => {
    if (tab !== 'users') return;
    const debounceTimer = setTimeout(() => {
      fetchTrackerUsers(trackerSearch);
    }, 400);
    return () => clearTimeout(debounceTimer);
  }, [trackerSearch, tab, fetchTrackerUsers]);

  // Reload when filters change
  useEffect(() => {
    if (tab !== 'users') return;
    fetchTrackerUsers(trackerSearch);
  }, [trackerFilterPortfolio, trackerFilterCertified, tab, trackerSearch, fetchTrackerUsers]);

  // Debounce email search — only fires API after 400ms of no typing
  useEffect(() => {
    if (tab !== 'email') return;
    const debounceTimer = setTimeout(() => {
      fetchEmailUsers(emailSearch);
    }, 400);
    return () => clearTimeout(debounceTimer);
  }, [emailSearch, tab, fetchEmailUsers]);

  // ── Ambassador tab effects ──────────────────────────────────────────────────
  useEffect(() => {
    if (tab !== 'ambassadors') return;
    loadAmbList(ambSearch);
    loadRewardRequests();
  }, [tab, ambStatusFilter, rewardReqFilter, loadAmbList, loadRewardRequests]);

  useEffect(() => {
    if (tab !== 'ambassadors') return;
    const timer = setTimeout(() => loadAmbList(ambSearch), 400);
    return () => clearTimeout(timer);
  }, [ambSearch, tab, loadAmbList]);


  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') return;

    const loadAnalytics = async () => {
      setAnalyticsLoading(true);
      setAnalyticsError('');
      try {
        const res = await api.get('/admin/analytics');
        setAnalytics(res.data);
      } catch (err) {
        setAnalyticsError(err.response?.data?.message || 'Failed to load admin analytics.');
      } finally {
        setAnalyticsLoading(false);
      }
    };

    loadAnalytics();
  }, [isAuthenticated, user?.role]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') return;

    let stopped = false;
    let timer = null;

    const loadWarmStatus = async () => {
      try {
        const res = await api.get('/events/admin/certificates/warm-event-pdfs/status');
        if (!stopped) {
          const status = res.data || null;
          setWarmJob(status);
          if (!status?.running && (status?.totalInDb ?? 0) === 0) {
            setWarmJobError('No event/job certificates exist yet. Generate at least one event certificate, then run fix again.');
          } else {
            setWarmJobError('');
          }
          if (status?.running) {
            timer = setTimeout(loadWarmStatus, 4000);
          }
        }
      } catch (err) {
        if (!stopped) {
          setWarmJobError(err.response?.data?.message || 'Failed to load warm job status.');
        }
      }
    };

    loadWarmStatus();
    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
    };
  }, [isAuthenticated, user?.role]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const validateJson = (raw) => {
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed.questions)) return 'Missing "questions" array';
      for (let i = 0; i < parsed.questions.length; i++) {
        const q = parsed.questions[i];
        if (!q.questionText) return `Question ${i + 1}: missing "questionText"`;
        if (!Array.isArray(q.options) || q.options.length < 2) return `Question ${i + 1}: needs at least 2 options`;
        if (typeof q.correctOptionIndex !== 'number') return `Question ${i + 1}: missing "correctOptionIndex"`;
        if (q.correctOptionIndex >= q.options.length) return `Question ${i + 1}: correctOptionIndex out of range`;
      }
      return null;
    } catch (e) {
      return 'Invalid JSON: ' + e.message;
    }
  };

  const handleLoadExisting = async () => {
    if (!selectedCourseId) return;
    setLoadingExisting(true);
    try {
      const res = await api.get(`/quizzes/${selectedCourseId}`);
      const { passingScore, questions, ribbonTheme } = res.data;
      setQuizJson(JSON.stringify({ passingScore, ribbonTheme: ribbonTheme || 'blue', questions }, null, 2));
      setJsonError('');
    } catch (err) {
      setJsonError(err.response?.status === 404 ? 'No quiz found for this course yet.' : 'Failed to load quiz.');
    } finally {
      setLoadingExisting(false);
    }
  };

  const handleJsonChange = (val) => {
    setQuizJson(val);
    setUploadStatus(null);
    if (val.trim()) {
      const err = validateJson(val);
      setJsonError(err || '');
    } else {
      setJsonError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedCourseId) {
      setJsonError('Please select a course first.');
      return;
    }
    const err = validateJson(quizJson);
    if (err) {
      setJsonError(err);
      return;
    }

    setUploadStatus('loading');
    setUploadMessage('');
    try {
      const parsed = JSON.parse(quizJson);
      await api.post(`/quizzes/${selectedCourseId}`, parsed);
      setUploadStatus('success');
      setUploadMessage(`Quiz saved to MongoDB for "${selectedCourseTitle}" successfully.`);
    } catch (err) {
      setUploadStatus('error');
      setUploadMessage(err.response?.data?.message || 'Upload failed. Is the backend running?');
    }
  };

  const handleLoadTemplate = () => {
    setQuizJson(JSON.stringify(QUIZ_TEMPLATE, null, 2));
    setJsonError('');
    setUploadStatus(null);
  };

  const questionCount = (() => {
    try { return JSON.parse(quizJson).questions?.length || 0; } catch { return 0; }
  })();

  const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 KB';
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(2)} KB`;
  };

  const startWarmCertificates = async () => {
    if (warmJobLoading) return;
    setWarmJobLoading(true);
    setWarmJobError('');
    try {
      const res = await api.post('/events/admin/certificates/warm-event-pdfs', { forceAll: true });
      setWarmJob(res.data?.job || null);
    } catch (err) {
      const statusCode = err.response?.status;
      if (statusCode === 409) {
        setWarmJobError('Warm job is already running. Showing live status below.');
      } else {
        setWarmJobError(err.response?.data?.message || 'Failed to start warm job.');
      }
    } finally {
      try {
        const statusRes = await api.get('/events/admin/certificates/warm-event-pdfs/status');
        const status = statusRes.data || null;
        setWarmJob(status);
        if (!status?.running && (status?.totalInDb ?? 0) === 0) {
          setWarmJobError('No event/job certificates exist yet. Generate at least one event certificate, then run fix again.');
        }
      } catch {
        // Keep existing warmJob state when status fetch fails.
      }
      setWarmJobLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100">
      <Helmet>
        <title>Admin Panel | SkillValix</title>
      </Helmet>

      <div className="bg-gradient-to-r from-indigo-700 via-violet-700 to-purple-700 shadow-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/25 shadow-lg">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-white">Admin Panel</h1>
                <p className="text-indigo-200 text-sm mt-0.5">Protected admin workspace for analytics, quiz operations, and course guidance.</p>
              </div>
            </div>

            <button
              onClick={handleExportAllUsers}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-xl transition-all flex items-center gap-2 border border-emerald-400 whitespace-nowrap"
            >
              Export All Users (CSV)
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-4 text-sm text-indigo-50">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-yellow-300 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Security notice</p>
                <p className="text-indigo-100/90 mt-1">
                  Admin access is controlled only by the role stored in the database. This website does not include any option to create admins, assign admins, or promote users.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
              {[
              { key: 'analytics', label: 'Analytics', icon: BarChart3 },
              { key: 'users', label: 'User Tracker', icon: Users },
              { key: 'hackathons', label: 'Hackathons', icon: Award },
              { key: 'host-requests', label: 'Host Requests', icon: Users },
              { key: 'simulations', label: 'Job Simulations', icon: Briefcase },
              { key: 'quiz', label: 'Quizzes', icon: ClipboardList },
              { key: 'coupons', label: 'Coupons', icon: Tag },
              { key: 'sim-coupons', label: 'Sim Coupons', icon: Percent },
              { key: 'pricing', label: 'Course Pricing', icon: IndianRupee },
              { key: 'email', label: 'Email Campaign', icon: Mail },
              { key: 'guide', label: 'Course Guide', icon: BookOpen },
              { key: 'ambassadors', label: 'Ambassadors', icon: Crown },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  tab === key
                    ? 'bg-white text-indigo-700 shadow-lg'
                    : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
                }`}
              >
                {React.createElement(Icon, { className: 'w-4 h-4' })}
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {tab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border-2 border-indigo-200 shadow-sm p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-600" />
                    Certificate Maintenance (Admin Only)
                  </h2>
                  <p className="text-sm text-slate-600 mt-2">
                    One-click fix for stale event/job certificate PDFs.
                  </p>
                </div>

                <div className="min-w-[240px]">
                  <button
                    onClick={startWarmCertificates}
                    disabled={warmJobLoading || warmJob?.running}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-bold shadow"
                  >
                    {warmJobLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    {warmJob?.running ? 'Fix Running...' : 'Fix Certificates Now'}
                  </button>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2"><span className="text-slate-500">Status</span><div className="font-bold text-slate-900 mt-0.5">{warmJob?.running ? 'Running' : 'Idle'}</div></div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2"><span className="text-slate-500">Progress</span><div className="font-bold text-slate-900 mt-0.5">{warmJob?.processed ?? 0}/{warmJob?.total ?? 0}</div></div>
                    <div className="rounded-lg border border-slate-200 bg-emerald-50 px-2.5 py-2"><span className="text-slate-500">Success</span><div className="font-bold text-emerald-700 mt-0.5">{warmJob?.success ?? 0}</div></div>
                    <div className="rounded-lg border border-slate-200 bg-rose-50 px-2.5 py-2"><span className="text-slate-500">Failed</span><div className="font-bold text-rose-700 mt-0.5">{warmJob?.failed ?? 0}</div></div>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2"><span className="text-slate-500">Mode</span><div className="font-bold text-slate-900 mt-0.5">{warmJob?.mode || 'stale-only'}</div></div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2"><span className="text-slate-500">In DB</span><div className="font-bold text-slate-900 mt-0.5">{warmJob?.totalInDb ?? 0}</div></div>
                  </div>
                </div>
              </div>

              {warmJob?.currentCertificateId && (
                <p className="mt-2 text-xs text-slate-600">Current certificate: <span className="font-mono">{warmJob.currentCertificateId}</span></p>
              )}

              {warmJob?.lastError && (
                <p className="mt-2 text-xs text-rose-700">Last error: {warmJob.lastError}</p>
              )}

              {warmJobError && (
                <p className="mt-2 text-xs text-rose-700">{warmJobError}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                { label: 'Total Users', value: analytics?.overview?.totalUsers ?? '-', icon: Users, tone: 'from-indigo-600 to-blue-600' },
                { label: 'Published Courses', value: analytics?.overview?.publishedCourses ?? '-', icon: BookOpen, tone: 'from-emerald-600 to-teal-600' },
                { label: 'Certificates', value: analytics?.overview?.totalCertificates ?? '-', icon: Award, tone: 'from-amber-500 to-orange-500' },
                { label: 'Quiz Coverage', value: analytics?.overview ? `${analytics.overview.quizCoverage}%` : '-', icon: Activity, tone: 'from-violet-600 to-fuchsia-600' },
              ].map(({ label, value, icon: Icon, tone }) => (
                <div key={label} className={`rounded-2xl bg-gradient-to-br ${tone} p-5 text-white shadow-lg`}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.15em] font-bold text-white/70">{label}</p>
                    {React.createElement(Icon, { className: 'w-5 h-5 text-white/90' })}
                  </div>
                  <p className="mt-4 text-4xl font-black leading-none">
                    {analyticsLoading ? <span className="inline-block h-10 w-20 rounded-lg bg-white/20 animate-pulse" /> : value}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-indigo-600" />
                      Admin Dashboard Overview
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Live platform analytics available only to authenticated admins.</p>
                  </div>
                  {analytics?.generatedAt && (
                    <span className="text-xs font-medium text-slate-400">Updated {formatDate(analytics.generatedAt)}</span>
                  )}
                </div>

                {analyticsError && (
                  <div className="mb-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{analyticsError}</span>
                  </div>
                )}

                {!analyticsLoading && !analyticsError && !analytics && (
                  <div className="mb-4 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>Analytics data is not available yet. Refresh this page after the backend update is live.</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Users</p>
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center justify-between"><span className="text-slate-500">Students</span><span className="font-bold text-slate-900">{analytics?.overview?.totalStudents ?? '-'}</span></div>
                      <div className="flex items-center justify-between"><span className="text-slate-500">Admins</span><span className="font-bold text-slate-900">{analytics?.overview?.totalAdmins ?? '-'}</span></div>
                      <div className="flex items-center justify-between"><span className="text-slate-500">Certified users</span><span className="font-bold text-slate-900">{analytics?.overview?.uniqueCertifiedUsers ?? '-'}</span></div>
                    </div>
                    <button
                      onClick={handleExportAllUsers}
                      className="mt-4 w-full px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition"
                    >
                      Export All Users (CSV)
                    </button>
                  </div>

                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Engagement & Assessment</p>
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center justify-between"><span className="text-slate-500">Total quizzes</span><span className="font-bold text-slate-900">{analytics?.overview?.totalQuizzes ?? '-'}</span></div>
                      <div className="flex items-center justify-between"><span className="text-slate-500">Best Engagement Day</span><span className="font-bold text-slate-900 capitalize">{analytics?.engagement?.peakWeekday ?? '-'}</span></div>
                      <div className="flex items-center justify-between"><span className="text-slate-500">Peak Time</span><span className="font-bold text-slate-900 capitalize">{analytics?.engagement?.peakTimeBucket ?? '-'}</span></div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Completion</p>
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center justify-between"><span className="text-slate-500">Courses with certificates</span><span className="font-bold text-slate-900">{analytics?.overview?.courseCompletionCoverage ?? '-'}%</span></div>
                      <div className="flex items-center justify-between"><span className="text-slate-500">Avg certs per certified user</span><span className="font-bold text-slate-900">{analytics?.engagement?.averageCertificatesPerCertifiedUser ?? '-'}</span></div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Permissions</p>
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center justify-between"><span className="text-slate-500">View analytics</span><span className="font-bold text-emerald-700">{analytics?.permissions?.canViewAnalytics ? 'Allowed' : 'Blocked'}</span></div>
                      <div className="flex items-center justify-between"><span className="text-slate-500">Manage quizzes</span><span className="font-bold text-emerald-700">{analytics?.permissions?.canManageQuizzes ? 'Allowed' : 'Blocked'}</span></div>
                      <div className="flex items-center justify-between"><span className="text-slate-500">Admin assignment</span><span className="font-bold text-slate-900">Database only</span></div>
                    </div>
                  </div>
                </div>

                {analytics?.charts && (
                  <div className="mt-8 grid grid-cols-1 gap-8">
                    <div className="h-full w-full rounded-3xl bg-white border border-slate-200/80 p-6 shadow-[0_8px_30px_rgb(15_23_42/0.06)]">
                      <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">User Growth</h3>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={analytics.charts.userGrowth} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            <CartesianGrid stroke="#e2e8f0" strokeDasharray="5 5" vertical={false} />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className="h-full w-full rounded-3xl bg-white border border-slate-200/80 p-6 shadow-[0_8px_30px_rgb(15_23_42/0.06)]">
                      <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">Certificates Issued</h3>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={analytics.charts.certificateGrowth} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid stroke="#e2e8f0" strokeDasharray="5 5" vertical={false} />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }} cursor={{fill: '#f1f5f9'}} />
                            <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {analytics?.charts?.loginsByHour && (() => {
                const data = analytics.charts.loginsByHour;
                const total = data.reduce((s, d) => s + d.count, 0);
                const peak = data.reduce((a, b) => b.count > a.count ? b : a, data[0]);
                const coloredData = data.map(d => ({ ...d, fill: d.hour === peak.hour ? '#4f46e5' : '#a5b4fc' }));
                return (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 pt-6 pb-4 border-b border-slate-100">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <h3 className="text-base font-bold text-slate-900">User Logins — 24-Hour Distribution</h3>
                          <p className="text-xs text-slate-400 mt-0.5">Based on last login time per user (UTC). Shows which hours attract the most logins.</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm shrink-0">
                          <div className="text-center">
                            <div className="font-bold text-slate-900">{total}</div>
                            <div className="text-xs text-slate-400">Total users w/ login</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-indigo-600">{peak.label}</div>
                            <div className="text-xs text-slate-400">Peak hour ({peak.count} logins)</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={coloredData} margin={{ top: 4, right: 16, bottom: 8, left: 0 }} barCategoryGap="18%">
                            <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
                            <XAxis
                              dataKey="label"
                              stroke="#94a3b8"
                              fontSize={10}
                              tickLine={false}
                              axisLine={false}
                              dy={8}
                              interval={0}
                              tick={{ fontSize: 9 }}
                            />
                            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} dx={-4} allowDecimals={false} />
                            <Tooltip
                              contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 8px 24px rgb(0 0 0/0.12)', fontSize: 13, padding: '10px 14px' }}
                              formatter={(v, _, p) => [<span style={{fontWeight:700}}>{v} logins</span>, p.payload.hour === peak.hour ? '🔥 Peak hour' : 'Login count']}
                              labelFormatter={(l) => `🕐 ${l} UTC`}
                              cursor={{ fill: '#eef2ff', rx: 4 }}
                            />
                            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                              {coloredData.map((entry, index) => (
                                <Cell key={index} fill={entry.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-indigo-600 inline-block"></span> Peak hour</span>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-indigo-200 inline-block"></span> Other hours</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {analytics?.charts?.certsBoughtByHour && (() => {
                const data = analytics.charts.certsBoughtByHour;
                const total = data.reduce((s, d) => s + d.count, 0);
                const peak = data.reduce((a, b) => b.count > a.count ? b : a, data[0]);
                const coloredData = data.map(d => ({ ...d, fill: d.hour === peak.hour ? '#d97706' : '#fde68a' }));
                return (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 pt-6 pb-4 border-b border-slate-100">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <h3 className="text-base font-bold text-slate-900">Certificates Issued — 24-Hour Distribution</h3>
                          <p className="text-xs text-slate-400 mt-0.5">Course completions + job simulation certificates by UTC hour. Shows peak purchase windows.</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm shrink-0">
                          <div className="text-center">
                            <div className="font-bold text-slate-900">{total}</div>
                            <div className="text-xs text-slate-400">Total certificates</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-amber-600">{peak.label}</div>
                            <div className="text-xs text-slate-400">Peak hour ({peak.count} certs)</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={coloredData} margin={{ top: 4, right: 16, bottom: 8, left: 0 }} barCategoryGap="18%">
                            <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
                            <XAxis
                              dataKey="label"
                              stroke="#94a3b8"
                              fontSize={10}
                              tickLine={false}
                              axisLine={false}
                              dy={8}
                              interval={0}
                              tick={{ fontSize: 9 }}
                            />
                            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} dx={-4} allowDecimals={false} />
                            <Tooltip
                              contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 8px 24px rgb(0 0 0/0.12)', fontSize: 13, padding: '10px 14px' }}
                              formatter={(v, _, p) => [<span style={{fontWeight:700}}>{v} certificates</span>, p.payload.hour === peak.hour ? '🏆 Peak hour' : 'Certificates']}
                              labelFormatter={(l) => `🕐 ${l} UTC`}
                              cursor={{ fill: '#fffbeb', rx: 4 }}
                            />
                            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                              {coloredData.map((entry, index) => (
                                <Cell key={index} fill={entry.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-600 inline-block"></span> Peak hour</span>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-200 inline-block"></span> Other hours</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  Access Policy
                </h2>
                <div className="mt-5 space-y-3">
                  {[
                    { icon: Database, title: 'Admin role source', desc: 'Admin users are recognized from the database role field only.' },
                    { icon: Lock, title: 'No website promotion', desc: 'There is no in-app button or form to make any user an admin.' },
                    { icon: Eye, title: 'Permission visibility', desc: 'This page explains what admins can access without allowing privilege changes.' },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                          {React.createElement(Icon, { className: 'w-5 h-5' })}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{title}</p>
                          <p className="text-sm text-slate-500 mt-1">{desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Top Course Analytics</h2>
                <div className="space-y-3">
                  {analyticsLoading && Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="h-20 rounded-xl bg-slate-100 animate-pulse" />
                  ))}
                  {!analyticsLoading && !analytics?.courseBreakdown?.length && (
                    <div className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                      No course analytics are available yet.
                    </div>
                  )}
                  {!analyticsLoading && analytics?.courseBreakdown?.map((course, idx) => (
                    <div key={course.courseId || course.slug} className="rounded-xl border border-slate-200 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">#{idx + 1}</p>
                          <p className="font-semibold text-slate-900 mt-1">{course.title}</p>
                          <p className="text-sm text-slate-500 mt-1">{course.lessonCount} lessons | {course.hasQuiz ? 'Quiz ready' : 'Quiz missing'}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                          {course.certificatesEarned} certs
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Certificate Queue Health</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Ready PDFs', value: analytics?.certificatePipeline?.ready ?? '-', tone: 'border-emerald-200 bg-emerald-50' },
                      { label: 'Pending', value: analytics?.certificatePipeline?.pending ?? '-', tone: 'border-slate-200 bg-slate-50' },
                      { label: 'Queued', value: analytics?.certificatePipeline?.queued ?? '-', tone: 'border-amber-200 bg-amber-50' },
                      { label: 'Generating', value: analytics?.certificatePipeline?.generating ?? '-', tone: 'border-indigo-200 bg-indigo-50' },
                      { label: 'Failed', value: analytics?.certificatePipeline?.failed ?? '-', tone: 'border-rose-200 bg-rose-50' },
                      { label: 'Queue Depth', value: analytics?.certificatePipeline?.queueDepth ?? '-', tone: 'border-violet-200 bg-violet-50' },
                    ].map(({ label, value, tone }) => (
                      <div key={label} className={`rounded-xl border p-4 ${tone}`}>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
                        <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">PDF Cache</p>
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center justify-between"><span className="text-slate-500">Cached PDFs</span><span className="font-bold text-slate-900">{analytics?.certificatePipeline?.cachedPdfCount ?? '-'}</span></div>
                      <div className="flex items-center justify-between"><span className="text-slate-500">Coverage</span><span className="font-bold text-slate-900">{analytics?.certificatePipeline?.cachedPdfCoverage ?? '-'}%</span></div>
                      <div className="flex items-center justify-between"><span className="text-slate-500">Avg PDF size</span><span className="font-bold text-slate-900">{analytics?.certificatePipeline?.averagePdfKb ? `${analytics.certificatePipeline.averagePdfKb} KB` : '-'}</span></div>
                      <div className="flex items-center justify-between"><span className="text-slate-500">Total cached size</span><span className="font-bold text-slate-900">{formatSize(analytics?.certificatePipeline?.totalCachedPdfBytes)}</span></div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-indigo-50 border border-indigo-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-indigo-700">One-Click Fix</p>
                    <p className="text-sm text-indigo-900 mt-1">Use the detailed Certificate Maintenance panel at the top of this page for accurate status and actions.</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Users</h2>
                  <div className="space-y-3">
                    {analyticsLoading && Array.from({ length: 4 }).map((_, idx) => (
                      <div key={idx} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
                    ))}
                    {!analyticsLoading && !analytics?.recentUsers?.length && (
                      <div className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                        No recent users were returned for analytics yet.
                      </div>
                    )}
                    {!analyticsLoading && analytics?.recentUsers?.map((entry) => (
                      <div key={`${entry.email}-${entry.createdAt}`} className="rounded-xl border border-slate-200 p-4 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{entry.name}</p>
                          <p className="text-sm text-slate-500 truncate">{entry.email}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-xs font-bold uppercase tracking-wide ${entry.role === 'admin' ? 'text-violet-700' : 'text-slate-500'}`}>{entry.role}</p>
                          <p className="text-xs text-slate-400 mt-1">{formatDate(entry.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Certificates</h2>
                  <div className="space-y-3">
                    {analyticsLoading && Array.from({ length: 4 }).map((_, idx) => (
                      <div key={idx} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
                    ))}
                    {!analyticsLoading && !analytics?.recentCertificates?.length && (
                      <div className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                        No recent certificate records were returned for analytics yet.
                      </div>
                    )}
                    {!analyticsLoading && analytics?.recentCertificates?.map((entry) => (
                      <div key={entry.certificateId} className="rounded-xl border border-slate-200 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 truncate">{entry.courseTitle}</p>
                            <p className="text-sm text-slate-500 truncate">{entry.studentName}{entry.studentEmail ? ` | ${entry.studentEmail}` : ''}</p>
                          </div>
                          <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded-lg shrink-0">{entry.certificateId}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">{formatDate(entry.issueDate)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {tab === 'users' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                User Tracker
              </h2>
              <p className="text-sm text-slate-500 mb-6">Search users, view their login stats, traffic sources, and portfolio details.</p>

              <div className="flex items-center gap-2 mb-6">
                <Search className="w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search users by name or email..."
                  className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none max-w-md"
                  value={trackerSearch}
                  onChange={(e) => setTrackerSearch(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-3 mb-6 pb-4 border-b border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                    checked={trackerFilterPortfolio}
                    onChange={(e) => setTrackerFilterPortfolio(e.target.checked)}
                  />
                  <span className="text-sm font-medium text-slate-700">Has Portfolio</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                    checked={trackerFilterCertified}
                    onChange={(e) => setTrackerFilterCertified(e.target.checked)}
                  />
                  <span className="text-sm font-medium text-slate-700">Has Certification</span>
                </label>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-xs">
                    <tr>
                      <th className="px-4 py-3 font-semibold rounded-tl-lg">User</th>
                      <th className="px-4 py-3 font-semibold">Traffic Source</th>
                      <th className="px-4 py-3 font-semibold">Login Stats</th>
                      <th className="px-4 py-3 font-semibold rounded-tr-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {trackerLoading ? (
                      <tr>
                        <td colSpan="4" className="text-center py-8 text-slate-500">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-500" />
                        </td>
                      </tr>
                    ) : trackerUsers.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-8 text-slate-500">No users found.</td>
                      </tr>
                    ) : (
                      trackerUsers.map(u => (
                        <tr key={u._id} className="hover:bg-slate-50 transition">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                                {u.name ? u.name[0].toUpperCase() : '?'}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900">{u.name}</p>
                                <p className="text-xs text-slate-500">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                              {u.trafficSource || 'direct'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs">
                            <p className="text-slate-900 font-medium">{u.loginCount || 0} logins</p>
                            <p className="text-slate-500">{u.lastLogin ? formatDate(u.lastLogin) : 'Never'}</p>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleViewTrackerDetails(u)}
                              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-lg transition"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* User Details Modal */}
            {trackerSelectedUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 sticky top-0 z-10">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-indigo-600" />
                      User Tracking Details
                    </h3>
                    <button onClick={() => setTrackerSelectedUser(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-6 overflow-y-auto flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Basic Info</p>
                          <p className="font-semibold text-slate-900 text-lg">{trackerSelectedUser.name}</p>
                          <p className="text-sm text-slate-500">{trackerSelectedUser.email}</p>
                          <p className="text-xs text-slate-400 mt-1">Joined: {formatDate(trackerSelectedUser.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Analytics Tracking</p>
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-slate-500">Traffic Source:</span> <span className="font-semibold text-slate-900">{trackerSelectedUser.trafficSource || 'direct'}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Total Logins:</span> <span className="font-semibold text-slate-900">{trackerSelectedUser.loginCount || 0}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Last Login:</span> <span className="font-semibold text-slate-900">{trackerSelectedUser.lastLogin ? formatDate(trackerSelectedUser.lastLogin) : 'Never'}</span></div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Portfolio & Links</p>
                        <div className="space-y-2">
                          {[
                            { label: 'Portfolio', val: trackerSelectedUser.portfolio, icon: Link2 },
                            { label: 'GitHub', val: trackerSelectedUser.github, icon: Link2 },
                            { label: 'LinkedIn', val: trackerSelectedUser.linkedin, icon: Link2 },
                            { label: 'Resume', val: trackerSelectedUser.resume, icon: FileJson },
                          ].map((l, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              {React.createElement(l.icon, { className: 'w-4 h-4 text-slate-400' })}
                              <span className="text-slate-500 w-16">{l.label}:</span>
                              {l.val ? (
                                <a href={l.val} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1 truncate">
                                  {l.val} <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <span className="text-slate-400 italic">Not provided</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3 border-b border-slate-100 pb-2">Certificates Earned</p>
                      {trackerDetailsLoading ? (
                        <div className="flex justify-center p-6"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
                      ) : !trackerDetails?.certificates || trackerDetails.certificates.length === 0 ? (
                        <div className="text-sm text-slate-500 italic p-4 bg-slate-50 rounded-xl border border-slate-100">No certificates earned yet.</div>
                      ) : (
                        <div className="space-y-3">
                          {trackerDetails.certificates.map(cert => (
                            <div key={cert._id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl">
                              <div>
                                <p className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                                  {cert.isEvent ? <Award className="w-4 h-4 text-emerald-500" /> : <BookOpen className="w-4 h-4 text-indigo-500" />}
                                  {cert.course?.title || cert.courseTitleSnapshot || 'Unknown'}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">Issued: {formatDate(cert.issueDate || cert.createdAt)}</p>
                              </div>
                              <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                                {cert.certificateId}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {tab === 'email' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-indigo-600" />
                Custom Email Campaign
              </h2>
              <p className="text-sm text-slate-500 mb-6">Send customized emails, announcements, or discount codes to your users.</p>

              {emailMsg.text && (
                <div className={`mb-4 p-3 rounded-xl border ${emailMsg.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
                  {emailMsg.text}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* User Selection */}
                <div className="border border-slate-200 rounded-xl flex flex-col h-[500px]">
                  <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <div className="flex items-center gap-2 mb-3">
                      <Search className="w-4 h-4 text-slate-400" />
                      <input 
                        type="text"
                        placeholder="Search users by name or email..."
                        className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={emailSearch}
                        onChange={(e) => setEmailSearch(e.target.value)}
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700 select-none">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                        checked={selectAllUsers}
                        onChange={(e) => {
                          setSelectAllUsers(e.target.checked);
                          if (e.target.checked) setSelectedEmails(new Set());
                        }}
                      />
                      Select All Users
                      {emailUsers.length > 0 && (
                        <span className="ml-1 text-xs font-normal text-slate-500">({emailUsers.length} loaded)</span>
                      )}
                    </label>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-2">
                    {emailUsersLoading ? (
                      <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
                    ) : (
                      emailUsers.map(u => (
                        <label key={u._id} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-slate-50 transition ${selectedEmails.has(u._id) ? 'bg-indigo-50 border border-indigo-100' : 'border border-transparent'}`}>
                          <input 
                            type="checkbox"
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                            checked={selectAllUsers || selectedEmails.has(u._id)}
                            disabled={selectAllUsers}
                            onChange={() => toggleEmailSelection(u._id)}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-slate-900 text-sm truncate">{u.name}</p>
                            <p className="text-xs text-slate-500 truncate">{u.email}</p>
                          </div>
                          {u.isVerified && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">Verified</span>}
                        </label>
                      ))
                    )}
                    {!emailUsersLoading && emailUsers.length === 0 && (
                      <div className="text-center p-4 text-slate-500 text-sm">No users found.</div>
                    )}
                  </div>
                </div>

                {/* Email Form */}
                <form onSubmit={handleSendEmail} className="flex flex-col h-[500px]">
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Subject</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Special Discount Inside!"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={emailForm.subject}
                      onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                    />
                  </div>
                  <div className="flex-1 flex flex-col mb-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Email Body (HTML supported)</label>
                    <textarea 
                      required
                      placeholder="<h1>Hello!</h1><p>Here is your discount code...</p>"
                      className="w-full flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm resize-none"
                      value={emailForm.html}
                      onChange={(e) => setEmailForm({...emailForm, html: e.target.value})}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={emailSending}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition"
                  >
                    {emailSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    {emailSending ? 'Sending...' : 'Send Email'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
        {tab === 'quiz' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-violet-50 px-6 py-4 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                  Select Course
                </h2>
              </div>
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <select
                      id="course-select"
                      value={selectedCourseId}
                      onChange={(e) => {
                        const opt = e.target.options[e.target.selectedIndex];
                        setSelectedCourseId(e.target.value);
                        setSelectedCourseTitle(opt.text);
                        setUploadStatus(null);
                        setJsonError('');
                      }}
                      className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-10 text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    >
                      <option value="">Select a course</option>
                      {courses.map(c => (
                        <option key={c._id} value={c._id}>{c.title}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>

                  <button
                    onClick={handleLoadExisting}
                    disabled={!selectedCourseId || loadingExisting}
                    className="flex items-center gap-2 px-5 py-3 bg-slate-700 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl font-semibold text-sm transition-all active:scale-95"
                  >
                    {loadingExisting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    Load Existing Quiz
                  </button>
                </div>

                {selectedCourseId && (
                  <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    Selected: <span className="font-semibold text-slate-700">{selectedCourseTitle}</span>
                    <span className="ml-1 text-slate-400">| Course ID: <code className="font-mono bg-slate-100 px-1 rounded">{selectedCourseId}</code></span>
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-violet-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                  Write / Paste Quiz JSON
                  {questionCount > 0 && (
                    <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                      {questionCount} question{questionCount !== 1 ? 's' : ''}
                    </span>
                  )}
                </h2>
                <button
                  onClick={handleLoadTemplate}
                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Load Template
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-slate-900 rounded-xl p-4 text-xs font-mono text-slate-300 overflow-x-auto">
                  <div className="text-slate-500 mb-2 text-xs uppercase tracking-wider font-sans font-bold">Expected JSON Format</div>
                  <pre className="whitespace-pre">{`{
  "passingScore": 60,
  "ribbonTheme": "gold",
  "questions": [
    {
      "questionText": "What does JS stand for?",
      "options": ["Java Standard", "JavaScript", "Just Script", "None"],
      "correctOptionIndex": 1
    }
  ]
}`}</pre>
                </div>

                <div className="relative">
                  <textarea
                    id="quiz-json-editor"
                    rows={18}
                    value={quizJson}
                    onChange={(e) => handleJsonChange(e.target.value)}
                    placeholder={'{\n  "passingScore": 60,\n  "questions": [...]\n}'}
                    spellCheck={false}
                    className={`w-full font-mono text-sm bg-slate-50 border rounded-xl px-4 py-4 focus:ring-2 outline-none transition resize-y leading-relaxed ${
                      jsonError
                        ? 'border-red-300 focus:ring-red-300 bg-red-50/30'
                        : quizJson && !jsonError
                        ? 'border-emerald-300 focus:ring-emerald-300'
                        : 'border-slate-200 focus:ring-indigo-400'
                    }`}
                  />
                  {quizJson && !jsonError && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3" /> Valid JSON
                    </div>
                  )}
                </div>

                {jsonError && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{jsonError}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-violet-50 px-6 py-4 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">3</span>
                  Save to MongoDB
                </h2>
              </div>
              <div className="p-6">
                <p className="text-slate-500 text-sm mb-5">
                  Clicking <strong>Upload Quiz</strong> will POST your JSON to the backend. If a quiz already exists for this course, it will be <strong>overwritten</strong>.
                </p>

                <button
                  id="upload-quiz-btn"
                  onClick={handleUpload}
                  disabled={!selectedCourseId || !quizJson || !!jsonError || uploadStatus === 'loading'}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-all duration-200 shadow-lg shadow-indigo-500/25 active:scale-95"
                >
                  {uploadStatus === 'loading'
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                    : <><Upload className="w-4 h-4" /> Upload Quiz to MongoDB</>
                  }
                </button>

                {uploadStatus === 'success' && (
                  <div className="mt-4 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-medium">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    {uploadMessage}
                  </div>
                )}
                {uploadStatus === 'error' && (
                  <div className="mt-4 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Upload failed</p>
                      <p className="opacity-80 mt-0.5">{uploadMessage}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {tab === 'hackathons' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900">Hackathons Dashboard</h2>
              <button
                onClick={() => {
                  if (showHackForm && editingHackId) {
                    resetHackForm();
                  }
                  setShowHackForm(!showHackForm);
                  setHackMsg('');
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition ${showHackForm ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'}`}
              >
                {showHackForm ? <><X className="w-4 h-4" /> Close Form</> : <><Plus className="w-4 h-4" /> Post a Hackathon</>}
              </button>
            </div>

            {showHackForm && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2"><Award className="w-5 h-5 text-amber-500" /> {editingHackId ? 'Edit Hackathon' : 'Post a Hackathon'} (Full Dynamic Control)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[['title', 'Title *'], ['slug', 'SEO Slug (e.g. ai-hackathon-2026)'], ['tagline', 'Tagline'], ['theme', 'Theme / Track'], ['image', 'Banner Image URL'], ['tags', 'Tags (comma-separated)'], ['accentColor', 'Accent Color (hex)']].map(([key, label]) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">{label}</label>
                    <input value={hackForm[key]} onChange={e => setHackForm(p => ({ ...p, [key]: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                  </div>
                ))}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
                    <select value={hackForm.status} onChange={e => setHackForm(p => ({ ...p, status: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm">
                      <option value="upcoming">Upcoming</option>
                      <option value="live">Live</option>
                      <option value="ended">Ended</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Hackathon Start Date</label>
                      <input type="datetime-local" value={hackForm.startDate} onChange={e => setHackForm(p => ({ ...p, startDate: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Registration Deadline</label>
                      <input type="datetime-local" value={hackForm.registrationDeadline} onChange={e => setHackForm(p => ({ ...p, registrationDeadline: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Submission Deadline</label>
                      <input type="datetime-local" value={hackForm.submissionDeadline} onChange={e => setHackForm(p => ({ ...p, submissionDeadline: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Team Min</label>
                    <input type="number" min="1" value={hackForm.teamMin} onChange={e => setHackForm(p => ({ ...p, teamMin: Number(e.target.value || 1) }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Team Max</label>
                    <input type="number" min="1" value={hackForm.teamMax} onChange={e => setHackForm(p => ({ ...p, teamMax: Number(e.target.value || 1) }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Description *</label>
                  <textarea value={hackForm.description} onChange={e => setHackForm(p => ({ ...p, description: e.target.value }))} rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                </div>

                <div className="sm:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <p className="md:col-span-2 text-xs font-black uppercase tracking-widest text-slate-500">Toggles</p>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={hackForm.paymentEnabled} onChange={e => setHackForm(p => ({ ...p, paymentEnabled: e.target.checked }))} className="rounded" />
                    Enable Payment
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={hackForm.visible} onChange={e => setHackForm(p => ({ ...p, visible: e.target.checked }))} className="rounded" />
                    Visible to public
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={hackForm.featured} onChange={e => setHackForm(p => ({ ...p, featured: e.target.checked }))} className="rounded" />
                    Featured card
                  </label>
                  <p className="md:col-span-2 text-xs font-black uppercase tracking-widest text-slate-500 mt-2">Accepted Link Types</p>
                   <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={hackForm.acceptsAnyLink} onChange={e => setHackForm(p => ({ ...p, acceptsAnyLink: e.target.checked }))} className="rounded" />
                    Accept Any Valid URL <span className="text-xs text-slate-400">(overrides below)</span>
                  </label>
                  <label className={`flex items-center gap-2 text-sm font-medium cursor-pointer ${hackForm.acceptsAnyLink ? 'text-slate-400' : 'text-slate-700'}`}>
                    <input type="checkbox" checked={hackForm.acceptsGitHubLink} onChange={e => setHackForm(p => ({ ...p, acceptsGitHubLink: e.target.checked }))} className="rounded" disabled={hackForm.acceptsAnyLink} />
                    GitHub repo links (github.com)
                  </label>
                  <label className={`flex items-center gap-2 text-sm font-medium cursor-pointer ${hackForm.acceptsAnyLink ? 'text-slate-400' : 'text-slate-700'}`}>
                    <input type="checkbox" checked={hackForm.acceptsNotionLink} onChange={e => setHackForm(p => ({ ...p, acceptsNotionLink: e.target.checked }))} className="rounded" disabled={hackForm.acceptsAnyLink} />
                    Notion links (notion.site / notion.so)
                  </label>
                  <label className={`flex items-center gap-2 text-sm font-medium cursor-pointer ${hackForm.acceptsAnyLink ? 'text-slate-400' : 'text-slate-700'}`}>
                    <input type="checkbox" checked={hackForm.acceptsDriveLink} onChange={e => setHackForm(p => ({ ...p, acceptsDriveLink: e.target.checked }))} className="rounded" disabled={hackForm.acceptsAnyLink} />
                    Google Drive links
                  </label>
                  <label className={`flex items-center gap-2 text-sm font-medium cursor-pointer ${hackForm.acceptsAnyLink ? 'text-slate-400' : 'text-slate-700'}`}>
                    <input type="checkbox" checked={hackForm.acceptsPdfLink} onChange={e => setHackForm(p => ({ ...p, acceptsPdfLink: e.target.checked }))} className="rounded" disabled={hackForm.acceptsAnyLink} />
                    Direct PDF links
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Payment Amount (INR)</label>
                  <input type="number" min="0" value={hackForm.paymentAmountInr} onChange={e => setHackForm(p => ({ ...p, paymentAmountInr: Number(e.target.value || 0) }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Max Submissions / Team</label>
                  <input type="number" min="1" value={hackForm.maxSubmissionsPerTeam} onChange={e => setHackForm(p => ({ ...p, maxSubmissionsPerTeam: Number(e.target.value || 1) }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Payment Description</label>
                  <input value={hackForm.paymentDescription} onChange={e => setHackForm(p => ({ ...p, paymentDescription: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                </div>

                {/* ── Submission link customisation ── */}
                <div className="sm:col-span-2 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-indigo-700 mb-3">Submission Link Field Labels</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Field Label (shown to user)</label>
                      <input value={hackForm.linkLabel} onChange={e => setHackForm(p => ({ ...p, linkLabel: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-indigo-200 bg-white text-sm" placeholder="Submission Link" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Placeholder Text</label>
                      <input value={hackForm.linkPlaceholder} onChange={e => setHackForm(p => ({ ...p, linkPlaceholder: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-indigo-200 bg-white text-sm" placeholder="Paste your link here..." />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Hint Text (below field)</label>
                      <input value={hackForm.linkHint} onChange={e => setHackForm(p => ({ ...p, linkHint: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-indigo-200 bg-white text-sm" placeholder="e.g. Share your GitHub repo or project demo link" />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Submission Instructions</label>
                  <textarea value={hackForm.submissionInstructions} onChange={e => setHackForm(p => ({ ...p, submissionInstructions: e.target.value }))} rows={2} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Problem Statement</label>
                  <textarea value={hackForm.problemStatement} onChange={e => setHackForm(p => ({ ...p, problemStatement: e.target.value }))} rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Rules (one per line)</label>
                  <textarea value={hackForm.rules} onChange={e => setHackForm(p => ({ ...p, rules: e.target.value }))} rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Judging Criteria (one per line)</label>
                  <textarea value={hackForm.judgingCriteria} onChange={e => setHackForm(p => ({ ...p, judgingCriteria: e.target.value }))} rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Prizes (one per line in format: Rank | Amount)</label>
                  <textarea value={hackForm.prizes} onChange={e => setHackForm(p => ({ ...p, prizes: e.target.value }))} rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" placeholder="1st | INR 50,000\n2nd | INR 25,000" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">FAQs (one per line in format: Question | Answer)</label>
                  <textarea value={hackForm.faqs} onChange={e => setHackForm(p => ({ ...p, faqs: e.target.value }))} rows={4} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm" placeholder="Who can join? | Any registered student\nCan solo join? | Yes, if team min is 1" />
                </div>
              </div>

              {hackMsg && <div className={`mt-4 p-3 rounded-xl text-sm font-medium ${hackMsg.startsWith('✅') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{hackMsg}</div>}

              <button
                onClick={async () => {
                  if (!hackForm.title || !hackForm.description) {
                    setHackMsg('❌ Title and description are required.');
                    return;
                  }
                  if (hackForm.teamMin > hackForm.teamMax) {
                    setHackMsg('❌ Team min cannot be greater than team max.');
                    return;
                  }

                  setHackSaving(true);
                  setHackMsg('');
                  try {
                    const prizes = (hackForm.prizes || '')
                      .split('\n')
                      .map((line) => line.trim())
                      .filter(Boolean)
                      .map((line) => {
                        const [rank, amount] = line.split('|').map((part) => (part || '').trim());
                        return { rank: rank || 'Prize', amount: amount || '' };
                      })
                      .filter((item) => item.amount);

                    const faqs = (hackForm.faqs || '')
                      .split('\n')
                      .map((line) => line.trim())
                      .filter(Boolean)
                      .map((line) => {
                        const [question, answer] = line.split('|').map((part) => (part || '').trim());
                        return { question, answer };
                      })
                      .filter((item) => item.question && item.answer);

                    const payloadTitle = hackForm.title || '';
                    const payloadSlug = hackForm.slug || '';
                    
                    const generatedSlug = payloadSlug 
                      ? payloadSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
                      : payloadTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

                    const payload = {
                      title: payloadTitle,
                      slug: generatedSlug,
                      tagline: hackForm.tagline,
                      description: hackForm.description,
                      theme: hackForm.theme,
                      startDate: hackForm.startDate || null,
                      registrationDeadline: hackForm.registrationDeadline || null,
                      submissionDeadline: hackForm.submissionDeadline || null,
                      status: hackForm.status || 'upcoming',
                      endDate: hackForm.endDate || null,
                      image: hackForm.image,
                      tags: (hackForm.tags || '').split(',').map(t => t.trim()).filter(Boolean),
                      visible: Boolean(hackForm.visible),
                      featured: Boolean(hackForm.featured),
                      prizes,
                      teamConfig: {
                        minMembers: Number(hackForm.teamMin),
                        maxMembers: Number(hackForm.teamMax),
                        requireExistingUsers: true,
                      },
                      paymentConfig: {
                        enabled: Boolean(hackForm.paymentEnabled),
                        amountInr: Number(hackForm.paymentAmountInr || 0),
                        description: hackForm.paymentDescription,
                      },
                      submissionConfig: {
                        acceptsAnyLink:    Boolean(hackForm.acceptsAnyLink),
                        acceptsDriveLink:  Boolean(hackForm.acceptsDriveLink),
                        acceptsPdfLink:    Boolean(hackForm.acceptsPdfLink),
                        acceptsGitHubLink: Boolean(hackForm.acceptsGitHubLink),
                        acceptsNotionLink: Boolean(hackForm.acceptsNotionLink),
                        instructions:      hackForm.submissionInstructions,
                        maxSubmissionsPerTeam: Number(hackForm.maxSubmissionsPerTeam || 3),
                        linkLabel:         hackForm.linkLabel || 'Submission Link',
                        linkPlaceholder:   hackForm.linkPlaceholder || 'Paste your submission link here...',
                        linkHint:          hackForm.linkHint || '',
                      },
                      contentConfig: {
                        problemStatement: hackForm.problemStatement,
                        rules: (hackForm.rules || '').split('\n').map(x => x.trim()).filter(Boolean),
                        judgingCriteria: (hackForm.judgingCriteria || '').split('\n').map(x => x.trim()).filter(Boolean),
                        faqs,
                      },
                      styleConfig: {
                        accentColor: hackForm.accentColor || '#4F46E5',
                        cardStyle: 'modern',
                        bannerStyle: 'gradient',
                      },
                    };

                    if (editingHackId) {
                      await api.put(`/events/hackathons/${editingHackId}`, payload);
                      setHackMsg('✅ Hackathon updated successfully!');
                    } else {
                      await api.post('/events/hackathons', payload);
                      setHackMsg('✅ Hackathon posted successfully!');
                    }
                    resetHackForm();
                    loadHacks();
                    setShowHackForm(false);
                  } catch (e) {
                    console.error("Post Hackathon Error:", e);
                    setHackMsg('❌ ' + (e.response?.data?.message || e.message || 'Failed to save.'));
                  } finally {
                    setHackSaving(false);
                  }
                }}
                disabled={hackSaving}
                className="mt-5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm hover:opacity-90 transition disabled:opacity-60"
              >
                {hackSaving ? 'Saving…' : editingHackId ? '💾 Update Hackathon' : '🚀 Post Hackathon'}
              </button>
              {editingHackId && (
                <button
                  onClick={() => { resetHackForm(); setHackMsg(''); setShowHackForm(false); }}
                  className="mt-3 ml-3 px-6 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition"
                >
                  Cancel Edit
                </button>
              )}
            </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-5">All Hackathons + Team Registrations</h2>
              {hacksLoading ? (
                <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-20 rounded-xl bg-slate-100 animate-pulse" />)}</div>
              ) : hacks.length === 0 ? (
                <p className="text-slate-400 text-sm">No hackathons created yet.</p>
              ) : (
                <div className="space-y-4">
                  {/* Overall Aggregate Analytics Bar */}
                  {(() => {
                    const totalEvents = hacks.length;
                    const totalParticipantsAll = hacks.reduce((acc, h) => acc + getHackAnalytics(h, registrationsByHack[h._id] || []).totalParticipants, 0);
                    const totalCertificatesAll = hacks.reduce((acc, h) => acc + getHackAnalytics(h, registrationsByHack[h._id] || []).totalCertificates, 0);
                    const totalSubmissionsAll = hacks.reduce((acc, h) => acc + getHackAnalytics(h, registrationsByHack[h._id] || []).totalSubmissions, 0);

                    return (
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-md mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="p-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">Hackathon Events</span>
                          <p className="text-2xl font-black text-white mt-0.5">{totalEvents}</p>
                        </div>
                        <div className="p-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Total Participants</span>
                          <p className="text-2xl font-black text-white mt-0.5">{totalParticipantsAll}</p>
                        </div>
                        <div className="p-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Certifications Issued</span>
                          <p className="text-2xl font-black text-white mt-0.5">{totalCertificatesAll}</p>
                        </div>
                        <div className="p-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Projects Submitted</span>
                          <p className="text-2xl font-black text-white mt-0.5">{totalSubmissionsAll}</p>
                        </div>
                      </div>
                    );
                  })()}

                  {hacks.map(h => {
                    const analytics = getHackAnalytics(h, registrationsByHack[h._id] || []);

                    return (
                      <div key={h._id} className="rounded-xl border border-slate-200 p-4 hover:border-indigo-200 transition">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-slate-900">{h.title}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${h.status === 'live' ? 'bg-emerald-100 text-emerald-700' : h.status === 'ended' ? 'bg-slate-100 text-slate-500' : 'bg-amber-100 text-amber-700'}`}>{h.status}</span>
                              {h.visible ? <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Visible</span> : <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-400">Hidden</span>}
                              {h.featured && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Featured</span>}
                            </div>
                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{h.description}</p>
                            <p className="text-xs text-slate-400 mt-2">
                              Team: {h.teamConfig?.minMembers || 1}-{h.teamConfig?.maxMembers || 4} | Payment: {h.paymentConfig?.enabled ? `INR ${h.paymentConfig?.amountInr || 0}` : 'Free'}
                            </p>

                            {/* Quick Individual Hackathon Analytics Summary Pill Bar */}
                            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Analytics:</span>
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 font-bold text-indigo-700">
                                <Users className="w-3.5 h-3.5 text-indigo-500" />
                                <span>Participation: <strong>{analytics.totalParticipants}</strong> ({analytics.teamsCount} teams)</span>
                              </div>
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-100 font-bold text-amber-700">
                                <Award className="w-3.5 h-3.5 text-amber-500" />
                                <span>Certifications: <strong>{analytics.totalCertificates}</strong></span>
                              </div>
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 font-bold text-emerald-700">
                                <ClipboardList className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Submissions: <strong>{analytics.totalSubmissions}</strong></span>
                              </div>
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-100 font-bold text-purple-700">
                                <Trophy className="w-3.5 h-3.5 text-purple-500" />
                                <span>Winners: <strong>{analytics.autoWinners}</strong></span>
                              </div>
                              {analytics.hasOverride && (
                                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 border border-violet-200">
                                  Frontend Managed
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 shrink-0 max-w-[340px] justify-end">
                            <button
                              onClick={() => openHackAnalyticsModal(h)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 transition flex items-center gap-1 shadow-sm"
                            >
                              <BarChart3 className="w-3.5 h-3.5" /> Analytics
                            </button>
                            <button
                              onClick={() => {
                                setEditingHackId(h._id);
                                setHackForm({
                                  title: h.title || '',
                                  slug: h.slug || '',
                                  tagline: h.tagline || '',
                                  description: h.description || '',
                                  theme: h.theme || '',
                                  status: h.status || 'upcoming',
                                  startDate: h.startDate ? new Date(h.startDate).toISOString().slice(0, 16) : '',
                                  registrationDeadline: h.registrationDeadline ? new Date(h.registrationDeadline).toISOString().slice(0, 16) : '',
                                  submissionDeadline: h.submissionDeadline ? new Date(h.submissionDeadline).toISOString().slice(0, 16) : '',
                                  endDate: h.endDate ? new Date(h.endDate).toISOString().slice(0, 16) : '',
                                  image: h.image || '',
                                  tags: (h.tags || []).join(', '),
                                  visible: Boolean(h.visible),
                                  featured: Boolean(h.featured),
                                  teamMin: Number(h.teamConfig?.minMembers || 1),
                                  teamMax: Number(h.teamConfig?.maxMembers || 4),
                                  paymentEnabled: Boolean(h.paymentConfig?.enabled),
                                  paymentAmountInr: Number(h.paymentConfig?.amountInr || 0),
                                  paymentDescription: h.paymentConfig?.description || 'Hackathon registration fee',
                                  acceptsAnyLink:    Boolean(h.submissionConfig?.acceptsAnyLink),
                                  acceptsDriveLink:  Boolean(h.submissionConfig?.acceptsDriveLink ?? true),
                                  acceptsPdfLink:    Boolean(h.submissionConfig?.acceptsPdfLink ?? true),
                                  acceptsGitHubLink: Boolean(h.submissionConfig?.acceptsGitHubLink ?? true),
                                  acceptsNotionLink: Boolean(h.submissionConfig?.acceptsNotionLink ?? true),
                                  submissionInstructions: h.submissionConfig?.instructions || '',
                                  maxSubmissionsPerTeam: Number(h.submissionConfig?.maxSubmissionsPerTeam || 3),
                                  linkLabel:         h.submissionConfig?.linkLabel || 'Submission Link',
                                  linkPlaceholder:   h.submissionConfig?.linkPlaceholder || 'Paste your submission link here...',
                                  linkHint:          h.submissionConfig?.linkHint || '',
                                  problemStatement: h.contentConfig?.problemStatement || '',
                                  rules: (h.contentConfig?.rules || []).join('\n'),
                                  judgingCriteria: (h.contentConfig?.judgingCriteria || []).join('\n'),
                                  prizes: (h.prizes || []).map((p) => `${p.rank || 'Prize'} | ${p.amount || ''}`).join('\n'),
                                  faqs: (h.contentConfig?.faqs || []).map((f) => `${f.question || ''} | ${f.answer || ''}`).join('\n'),
                                  accentColor: h.styleConfig?.accentColor || '#4F46E5',
                                });
                                setHackMsg('📝 Edit mode enabled. Update fields and click "Update Hackathon".');
                                setShowHackForm(true);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-100 text-amber-700 hover:bg-amber-200 transition"
                            >
                              Edit
                            </button>
                            <button onClick={async () => { await api.put(`/events/hackathons/${h._id}`, { visible: !h.visible }); loadHacks(); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${h.visible ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>
                              {h.visible ? 'Hide' : 'Show'}
                            </button>
                            <button onClick={() => loadRegistrations(h._id)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition">
                              Teams
                            </button>
                            <button onClick={() => openCertIssuePanel(h)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition">
                              Issue Certificates
                            </button>
                            <button onClick={() => handleExportHackathonUsers(h._id)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition">
                              Export Teams CSV
                            </button>
                            <button onClick={async () => { if (!confirm('Delete this hackathon?')) return; await api.delete(`/events/hackathons/${h._id}`); loadHacks(); }} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition">
                              Delete
                            </button>
                          </div>
                        </div>

                      {activeCertIssueHackId === h._id && (
                        <div className="mt-4 p-5 rounded-xl border border-amber-200 bg-amber-50/20 space-y-4">
                          <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                              <Award className="w-4 h-4 text-amber-600" /> Issue Hackathon Certificates
                            </h4>
                            <button onClick={() => setActiveCertIssueHackId('')} className="text-slate-400 hover:text-slate-600">
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Certificate Type */}
                            <div>
                              <label className="block text-xs font-semibold text-slate-500 mb-1">Certificate Type</label>
                              <select
                                value={certIssueForm.certType}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setCertIssueForm(p => ({
                                    ...p,
                                    certType: val,
                                    customTitle: val === 'winner'
                                      ? `Certificate of Achievement in ${certIssueHackTitle || 'Hackathon'}`
                                      : `Certificate of Participation in ${certIssueHackTitle || 'Hackathon'}`,
                                    customBody: val === 'winner'
                                      ? `This certificate is proudly awarded to {studentName} in recognition of securing {winnerRank} in ${certIssueHackTitle || 'the hackathon'}, demonstrating exceptional innovation, technical skills, and teamwork as a member of team "{teamName}".`
                                      : `This certificate is proudly awarded to {studentName} for active and valuable participation in ${certIssueHackTitle || 'the hackathon'}, demonstrating outstanding creativity, technical problem solving, and collaboration as a member of team "{teamName}".`
                                  }));
                                }}
                                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm"
                              >
                                <option value="participation">Participation Certificate</option>
                                <option value="winner">Winner Certificate</option>
                              </select>
                            </div>

                            {/* Custom Title */}
                            <div>
                              <label className="block text-xs font-semibold text-slate-500 mb-1">Certificate Title (Main Headline)</label>
                              <input
                                type="text"
                                value={certIssueForm.customTitle}
                                onChange={(e) => setCertIssueForm(p => ({ ...p, customTitle: e.target.value }))}
                                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-semibold text-slate-800"
                                placeholder="e.g. OF PARTICIPATION"
                              />
                            </div>

                            {/* Custom Body */}
                            <div className="sm:col-span-2">
                              <label className="block text-xs font-semibold text-slate-500 mb-1">
                                Certificate Body Text (Supports: <code>{`{studentName}`}</code>, <code>{`{teamName}`}</code>, <code>{`{hackathonTitle}`}</code>, <code>{`{winnerRank}`}</code>)
                              </label>
                              <textarea
                                value={certIssueForm.customBody}
                                onChange={(e) => setCertIssueForm(p => ({ ...p, customBody: e.target.value }))}
                                rows={3}
                                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm leading-relaxed"
                                placeholder="Enter certificate text template..."
                              />
                            </div>

                            {/* Target Audience Mode */}
                            <div className="sm:col-span-2">
                              <label className="block text-xs font-semibold text-slate-500 mb-2">Recipient Group</label>
                              <div className="flex flex-wrap gap-4">
                                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="targetMode"
                                    value="all"
                                    checked={certIssueForm.targetMode === 'all'}
                                    onChange={() => setCertIssueForm(p => ({ ...p, targetMode: 'all', winnerRankFilter: [] }))}
                                  />
                                  All Registered Teams
                                </label>
                                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="targetMode"
                                    value="winners"
                                    checked={certIssueForm.targetMode === 'winners'}
                                    onChange={() => setCertIssueForm(p => ({ ...p, targetMode: 'winners', winnerRankFilter: [] }))}
                                  />
                                  Winners Only
                                </label>
                                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="targetMode"
                                    value="selected"
                                    checked={certIssueForm.targetMode === 'selected'}
                                    onChange={() => setCertIssueForm(p => ({ ...p, targetMode: 'selected', winnerRankFilter: [] }))}
                                  />
                                  Specific Selected Teams
                                </label>
                              </div>

                              {/* Rank filter checkboxes — visible only when "Winners Only" is selected */}
                              {certIssueForm.targetMode === 'winners' && (
                                <div className="mt-3 flex flex-wrap items-center gap-3">
                                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Filter by Rank:</span>
                                  {['1st', '2nd', '3rd'].map(rank => (
                                    <label key={rank} className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer bg-white border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition">
                                      <input
                                        type="checkbox"
                                        checked={certIssueForm.winnerRankFilter?.includes(rank) || false}
                                        onChange={(e) => {
                                          const checked = e.target.checked;
                                          setCertIssueForm(p => {
                                            const current = p.winnerRankFilter || [];
                                            const updated = checked
                                              ? [...current, rank]
                                              : current.filter(r => r !== rank);
                                            return { ...p, winnerRankFilter: updated };
                                          });
                                        }}
                                        className="w-3.5 h-3.5 rounded text-indigo-600"
                                      />
                                      <span className="font-semibold">{rank}</span>
                                    </label>
                                  ))}
                                  {certIssueForm.winnerRankFilter?.length > 0 && certIssueForm.winnerRankFilter.length < 3 && (
                                    <span className="text-xs text-amber-600 font-medium ml-1">
                                      Will issue only to <strong>{certIssueForm.winnerRankFilter.join(', ')}</strong> rank winners
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Selected Teams Checklist */}
                            {certIssueForm.targetMode === 'selected' && (
                              <div className="sm:col-span-2 bg-white border border-slate-200 rounded-xl p-3 max-h-48 overflow-y-auto space-y-1">
                                <p className="text-xs font-bold text-slate-400 mb-2">Select Teams to Receive Certificate:</p>
                                {(registrationsByHack[h._id] || []).length === 0 ? (
                                  <p className="text-xs text-slate-400 italic">No registrations loaded. Click "Teams" button above to load registrations first.</p>
                                ) : (
                                  (registrationsByHack[h._id] || []).map(reg => (
                                    <label key={reg._id} className="flex items-center gap-2 text-xs text-slate-700 hover:bg-slate-50 p-1 rounded cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={certIssueForm.selectedTeamIds.includes(reg._id)}
                                        onChange={(e) => {
                                          const checked = e.target.checked;
                                          setCertIssueForm(p => {
                                            const ids = checked
                                              ? [...p.selectedTeamIds, reg._id]
                                              : p.selectedTeamIds.filter(id => id !== reg._id);
                                            return { ...p, selectedTeamIds: ids };
                                          });
                                        }}
                                      />
                                      <span className="font-semibold">{reg.teamName}</span>
                                      <span className="text-slate-400">({reg.leader?.name || 'No Leader'})</span>
                                      {reg.isWinner && <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 rounded font-bold">🏆 {reg.winnerRank}</span>}
                                    </label>
                                  ))
                                )}
                              </div>
                            )}
                          </div>

                          {certIssueMsg && (
                            <div className={`p-3 rounded-xl text-xs font-semibold ${certIssueMsg.startsWith('✅') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                              {certIssueMsg}
                            </div>
                          )}

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleIssueCertificates(h._id)}
                              disabled={certIssueSaving || (certIssueForm.targetMode === 'selected' && certIssueForm.selectedTeamIds.length === 0)}
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold hover:opacity-90 transition disabled:opacity-50"
                            >
                              {certIssueSaving ? 'Processing...' : 'Issue Certificates'}
                            </button>
                            <button
                              onClick={() => setActiveCertIssueHackId('')}
                              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      )}

                      {loadingRegistrationsFor === h._id && <div className="mt-3 text-xs text-slate-500">Loading team registrations...</div>}

                      {Array.isArray(registrationsByHack[h._id]) && registrationsByHack[h._id].length > 0 && (
                        <div className="mt-4">
                          <div className="overflow-x-auto rounded-xl border border-slate-200">
                            <table className="w-full text-xs">
                              <thead>
                              <tr className="bg-slate-50 border-b border-slate-200">
                                  <th className="px-3 py-2 text-left font-bold text-slate-600">Team</th>
                                  <th className="px-3 py-2 text-left font-bold text-slate-600">Leader</th>
                                  <th className="px-3 py-2 text-left font-bold text-slate-600">Members</th>
                                  <th className="px-3 py-2 text-left font-bold text-slate-600">Submissions</th>
                                  <th className="px-3 py-2 text-left font-bold text-slate-600">Payment</th>
                                  <th className="px-3 py-2 text-left font-bold text-slate-600">Score /100</th>
                                  <th className="px-3 py-2 text-left font-bold text-slate-600">Winner</th>
                                  <th className="px-3 py-2 text-left font-bold text-slate-600">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {registrationsByHack[h._id].map(reg => (
                                  <tr key={reg._id} className="hover:bg-slate-50 transition-colors align-top">
                                    {/* Team Name */}
                                    <td className="px-3 py-2.5">
                                      <p className="font-bold text-slate-900">{reg.teamName}</p>
                                      {reg.isWinner && <span className="inline-block mt-1 text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">🏆 {reg.winnerRank || 'Winner'}</span>}
                                    </td>
                                    {/* Leader */}
                                    <td className="px-3 py-2.5">
                                      <p className="font-semibold text-slate-800">{reg.leader?.name || '—'}</p>
                                      <p className="text-slate-400">{reg.leader?.email || ''}</p>
                                    </td>
                                    {/* Members */}
                                    <td className="px-3 py-2.5">
                                      <div className="space-y-1">
                                        {(reg.members || []).map((m, mi) => (
                                          <div key={mi}>
                                            <span className="font-medium text-slate-800">{m.name || m.user?.name || '—'}</span>
                                            <span className="text-slate-400 ml-1">({m.email})</span>
                                          </div>
                                        ))}
                                      </div>
                                    </td>
                                    {/* Submissions */}
                                    <td className="px-3 py-2.5">
                                      {(reg.submissions || []).length === 0 ? (
                                        <span className="text-slate-400 italic">None</span>
                                      ) : (
                                        <div className="space-y-1">
                                          {reg.submissions.map((sub, si) => (
                                            <div key={si} className="flex items-center gap-1">
                                              <span className="text-slate-400">{si + 1}.</span>
                                              <a href={sub.link} target="_blank" rel="noopener noreferrer"
                                                className="text-indigo-600 underline hover:text-indigo-800 max-w-[160px] truncate block"
                                                title={sub.link}>
                                                {sub.link}
                                              </a>
                                              <ExternalLink className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </td>
                                    {/* Payment */}
                                    <td className="px-3 py-2.5">
                                      <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                                        reg.payment?.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                                        reg.payment?.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                        'bg-slate-100 text-slate-500'
                                      }`}>
                                        {reg.payment?.status || 'not_required'}
                                      </span>
                                    </td>
                                    {/* Score input */}
                                    <td className="px-3 py-2.5">
                                      <div className="flex items-center gap-1">
                                        <input
                                          type="number" min="0" max="100"
                                          defaultValue={reg.score ?? 0}
                                          onBlur={async (e) => {
                                            const val = Number(e.target.value);
                                            if (val < 0 || val > 100) { e.target.value = reg.score ?? 0; return; }
                                            try {
                                              await api.put(`/events/admin/hackathons/${h._id}/registrations/${reg._id}/score`, { score: val });
                                            } catch { e.target.value = reg.score ?? 0; }
                                          }}
                                          className="w-14 px-2 py-1 border border-slate-200 rounded text-xs text-center focus:ring-2 focus:ring-indigo-400 outline-none"
                                        />
                                        {reg.scoredAt && <span className="text-slate-300 text-xs" title={`Scored ${new Date(reg.scoredAt).toLocaleDateString()}`}>✓</span>}
                                      </div>
                                    </td>
                                    {/* Winner actions */}
                                    <td className="px-3 py-2.5">
                                      {reg.isWinner ? (
                                        <div className="flex flex-col gap-1">
                                          <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                                            <Trophy className="w-3 h-3" /> {reg.winnerRank || 'Winner'}
                                          </span>
                                          <button
                                            onClick={() => handleRemoveWinner(h._id, reg._id)}
                                            disabled={winnerSaving[reg._id]}
                                            className="px-2 py-0.5 rounded bg-red-50 text-red-600 hover:bg-red-100 text-[10px] font-bold transition disabled:opacity-50 flex items-center gap-1"
                                          >
                                            {winnerSaving[reg._id] ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Trash2 className="w-2.5 h-2.5" />}
                                            Remove
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="flex flex-col gap-1">
                                          {winnerFormOpen[reg._id] ? (
                                            <>
                                              <select
                                                value={winnerRankInputs[reg._id] || ''}
                                                onChange={(e) => setWinnerRankInputs(prev => ({ ...prev, [reg._id]: e.target.value }))}
                                                className="px-1.5 py-0.5 rounded border border-slate-200 text-[10px] bg-white"
                                              >
                                                <option value="">Select rank...</option>
                                                <option value="1st">1st Place</option>
                                                <option value="2nd">2nd Place</option>
                                                <option value="3rd">3rd Place</option>
                                                <option value="winner">Winner</option>
                                              </select>
                                              <div className="flex gap-1">
                                                <button
                                                  onClick={() => handleSetWinner(h._id, reg._id, winnerRankInputs[reg._id] || 'winner', winnerNoteInputs[reg._id] || '')}
                                                  disabled={winnerSaving[reg._id] || !winnerRankInputs[reg._id]}
                                                  className="px-1.5 py-0.5 rounded bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold transition disabled:opacity-50 flex items-center gap-1"
                                                >
                                                  {winnerSaving[reg._id] ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Trophy className="w-2.5 h-2.5" />}
                                                  Save
                                                </button>
                                                <button
                                                  onClick={() => setWinnerFormOpen(prev => ({ ...prev, [reg._id]: false }))}
                                                  className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold transition"
                                                >
                                                  Cancel
                                                </button>
                                              </div>
                                            </>
                                          ) : (
                                            <button
                                              onClick={() => setWinnerFormOpen(prev => ({ ...prev, [reg._id]: true }))}
                                              className="px-2 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-700 text-[10px] font-bold transition flex items-center gap-1"
                                            >
                                              <Trophy className="w-2.5 h-2.5" />
                                              Set Winner
                                            </button>
                                          )}
                                        </div>
                                      )}
                                    </td>
                                    {/* Status dropdown */}
                                    <td className="px-3 py-2.5">
                                      <select
                                        value={reg.status}
                                        onChange={async (e) => {
                                          await api.put(`/events/admin/hackathons/${h._id}/registrations/${reg._id}`, {
                                            status: e.target.value,
                                            adminRemarks: reg.adminRemarks || '',
                                          });
                                          loadRegistrations(h._id);
                                        }}
                                        className="px-2 py-1 rounded border border-slate-200 text-xs"
                                      >
                                        {['registered', 'payment_pending', 'submitted', 'under_review', 'approved', 'rejected'].map(s => <option key={s} value={s}>{s}</option>)}
                                      </select>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {Array.isArray(registrationsByHack[h._id]) && registrationsByHack[h._id].length === 0 && loadingRegistrationsFor !== h._id && (
                        <div className="mt-3 text-xs text-slate-500">No team registrations yet.</div>
                      )}
                    </div>
                  );
                })}
                </div>
              )}
            </div>

            {/* Individual Hackathon Analytics Management Modal */}
            {activeAnalyticsHack && (() => {
              const currentAnalytics = getHackAnalytics(activeAnalyticsHack, registrationsByHack[activeAnalyticsHack._id] || []);
              const hackTitle = activeAnalyticsHack.title || 'Hackathon';

              return (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                  <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
                    {/* Modal Header */}
                    <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 px-6 py-5 text-white flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-white/10 border border-white/10">
                          <BarChart3 className="w-5 h-5 text-purple-300" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg text-white">Hackathon Analytics</h3>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              activeAnalyticsHack.status === 'live' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                              activeAnalyticsHack.status === 'ended' ? 'bg-slate-500/20 text-slate-300 border border-slate-500/30' :
                              'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}>
                              {activeAnalyticsHack.status}
                            </span>
                          </div>
                          <p className="text-xs text-indigo-200 mt-0.5 truncate max-w-md">{hackTitle}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveAnalyticsHack(null)}
                        className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 overflow-y-auto space-y-6">
                      {/* Status Message */}
                      {hackAnalyticsMsg && (
                        <div className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                          hackAnalyticsMsg.includes('✅') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}>
                          <span>{hackAnalyticsMsg}</span>
                        </div>
                      )}

                      {/* System Auto-calculated Live Metrics */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">System Auto-Calculated Metrics</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                            <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-medium mb-1">
                              <Users className="w-3.5 h-3.5" /> Teams Registered
                            </div>
                            <p className="text-xl font-black text-indigo-950">{currentAnalytics.teamsCount}</p>
                          </div>
                          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100">
                            <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium mb-1">
                              <Users className="w-3.5 h-3.5" /> Auto Participants
                            </div>
                            <p className="text-xl font-black text-blue-950">{currentAnalytics.autoParticipants}</p>
                          </div>
                          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100">
                            <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium mb-1">
                              <Award className="w-3.5 h-3.5" /> DB Certifications
                            </div>
                            <p className="text-xl font-black text-amber-950">{currentAnalytics.dbCertificatesCount}</p>
                          </div>
                          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mb-1">
                              <ClipboardList className="w-3.5 h-3.5" /> Auto Submissions
                            </div>
                            <p className="text-xl font-black text-emerald-950">{currentAnalytics.autoSubmissions}</p>
                          </div>
                        </div>
                      </div>

                      {/* Backend MongoDB Event Certificate Breakdown */}
                      <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">MongoDB Database Certificate Tracking</span>
                          </div>
                          <button
                            onClick={() => openCertIssuePanel(activeAnalyticsHack)}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-amber-500 hover:bg-amber-600 text-white transition flex items-center gap-1"
                          >
                            <Award className="w-3 h-3" /> Issue Certificates
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-3 pt-1">
                          <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 text-center">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Issued</span>
                            <p className="text-lg font-black text-amber-300 mt-0.5">{currentAnalytics.dbCertificatesCount}</p>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 text-center">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Participation</span>
                            <p className="text-lg font-black text-indigo-300 mt-0.5">{currentAnalytics.dbParticipationCerts}</p>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 text-center">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Winners</span>
                            <p className="text-lg font-black text-emerald-300 mt-0.5">{currentAnalytics.dbWinnerCerts}</p>
                          </div>
                        </div>
                      </div>

                      {/* Frontend Managed Custom Overrides */}
                      <div className="border-t border-slate-100 pt-5 space-y-4">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
                            <span>Frontend Managed Custom Analytics Overrides</span>
                            {currentAnalytics.hasOverride && (
                              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 border border-violet-200">
                                Active Override
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1">
                            Customize displayed metrics for this hackathon across the admin dashboard. Leave empty to use system auto-calculated counts.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {/* Total Participants Override */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Total Participants
                            </label>
                            <input
                              type="number"
                              min="0"
                              placeholder={`Auto: ${currentAnalytics.autoParticipants}`}
                              value={hackAnalyticsInputs.totalParticipants}
                              onChange={(e) => setHackAnalyticsInputs(prev => ({ ...prev, totalParticipants: e.target.value }))}
                              className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition"
                            />
                            <span className="text-[10px] text-slate-400 mt-1 block">Custom total participant count</span>
                          </div>

                          {/* Total Certifications Override */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Total Certifications
                            </label>
                            <input
                              type="number"
                              min="0"
                              placeholder={`Auto: ${currentAnalytics.autoCertificates}`}
                              value={hackAnalyticsInputs.totalCertificates}
                              onChange={(e) => setHackAnalyticsInputs(prev => ({ ...prev, totalCertificates: e.target.value }))}
                              className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition"
                            />
                            <span className="text-[10px] text-slate-400 mt-1 block">Custom total certificates issued</span>
                          </div>

                          {/* Total Submissions Override */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Total Submissions
                            </label>
                            <input
                              type="number"
                              min="0"
                              placeholder={`Auto: ${currentAnalytics.autoSubmissions}`}
                              value={hackAnalyticsInputs.totalSubmissions}
                              onChange={(e) => setHackAnalyticsInputs(prev => ({ ...prev, totalSubmissions: e.target.value }))}
                              className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition"
                            />
                            <span className="text-[10px] text-slate-400 mt-1 block">Custom total project submissions</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                      <button
                        onClick={() => handleResetHackAnalyticsOverride(activeAnalyticsHack._id || activeAnalyticsHack.slug)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Reset to Auto Metrics
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveAnalyticsHack(null)}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveHackAnalyticsOverride(activeAnalyticsHack._id || activeAnalyticsHack.slug)}
                          className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/20 transition flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Save Overrides
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
        {tab === 'guide' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileJson className="w-5 h-5 text-indigo-600" />
                How to Add / Edit Courses
              </h2>

              <ol className="space-y-5 text-slate-700">
                {[
                  {
                    step: '1',
                    title: 'Open all-courses.json',
                    desc: 'Located at frontend/public/data/all-courses.json. This is the single source of truth for all course content.',
                  },
                  {
                    step: '2',
                    title: 'Add a new entry at the bottom of the array',
                    desc: 'Each course entry has two keys: "course" (metadata) and "lessons" (array of lesson objects). Copy an existing entry and update the fields.',
                  },
                  {
                    step: '3',
                    title: 'Required fields for a course',
                    desc: '_id (unique hex), title, slug (kebab-case, used in URL), description, image (URL), theme (blue/green/orange/pink), published (true/false)',
                  },
                  {
                    step: '4',
                    title: 'Required fields for each lesson',
                    desc: '_id (unique hex), course (same as course._id), title, content (HTML string), order (1, 2, 3...)',
                  },
                  {
                    step: '5',
                    title: 'Save the file',
                    desc: 'Vite dev server hot-reloads instantly. In production, redeploy the frontend build. No backend changes needed.',
                  },
                ].map(({ step, title, desc }) => (
                  <li key={step} className="flex gap-4 items-start">
                    <span className="w-7 h-7 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">{step}</span>
                    <div>
                      <p className="font-semibold text-slate-900">{title}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-violet-600" />
                Course Entry Template
              </h2>
              <div className="bg-slate-900 rounded-xl overflow-hidden">
                <div className="bg-slate-800 px-4 py-2 text-xs text-slate-400 font-mono">all-courses.json - new course entry</div>
                <pre className="p-5 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre">{`{
  "course": {
    "_id": "UNIQUE_HEX_24_CHARS",
    "title": "My New Course",
    "slug": "my-new-course",
    "description": "Short description here.",
    "image": "https://link-to-image.jpg",
    "instructor": "69b7983467bb2f063cefab80",
    "published": true,
    "theme": "orange",
    "createdAt": "2026-03-17T00:00:00.000Z",
    "updatedAt": "2026-03-17T00:00:00.000Z",
    "__v": 0
  },
  "lessons": [
    {
      "_id": "UNIQUE_HEX_24_CHARS",
      "course": "SAME_AS_COURSE_ID",
      "title": "1. Introduction",
      "content": "<h2>Welcome!</h2><p>Your lesson HTML here.</p>",
      "videoUrl": "",
      "order": 1,
      "__v": 0,
      "createdAt": "2026-03-17T00:00:00.000Z",
      "updatedAt": "2026-03-17T00:00:00.000Z"
    }
  ]
}`}</pre>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Themes Available
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'blue', cls: 'bg-indigo-600' },
                  { name: 'green', cls: 'bg-emerald-600' },
                  { name: 'orange', cls: 'bg-amber-500' },
                  { name: 'pink', cls: 'bg-rose-600' },
                ].map(({ name, cls }) => (
                  <span key={name} className={`${cls} text-white px-3 py-1 rounded-full text-xs font-bold`}>{name}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'host-requests' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-6 h-6 text-indigo-600" />
                  Host Requests (B2B)
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleExportAllUsers}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-sm flex items-center gap-2"
                  >
                    Export All Users
                  </button>
                  <button
                    onClick={loadHostRequests}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-sm flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" /> Refresh
                  </button>
                </div>
              </div>

              {hostRequestsLoading ? (
                <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />)}</div>
              ) : hostRequests.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
                  No hosting requests received yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {hostRequests.map(req => (
                    <div key={req._id} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-lg text-slate-900">{req.organization}</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                              req.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                              req.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                              req.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                              'bg-slate-200 text-slate-600'
                            }`}>
                              {req.status.toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-2">
                            <div><span className="text-slate-500 text-xs block">Contact Name</span><span className="font-medium">{req.name}</span></div>
                            <div><span className="text-slate-500 text-xs block">Email</span><a href={`mailto:${req.email}`} className="font-medium text-indigo-600 hover:underline">{req.email}</a></div>
                            <div><span className="text-slate-500 text-xs block">Expected Pax</span><span className="font-medium text-slate-700">{req.expectedParticipants || 'Not specified'}</span></div>
                            <div><span className="text-slate-500 text-xs block">Date Submitted</span><span className="font-medium text-slate-700">{formatDate(req.createdAt)}</span></div>
                          </div>
                          
                          {req.message && (
                            <div className="mt-4 p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600">
                              <span className="font-semibold text-slate-400 block mb-1">Message:</span>
                              {req.message}
                            </div>
                          )}
                        </div>

                        <div className="shrink-0 flex flex-row md:flex-col gap-2">
                          <select 
                            value={req.status} 
                            onChange={(e) => updateHostRequestStatus(req._id, e.target.value)}
                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold bg-white cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="approved">Approved & Created</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          {req.status !== 'approved' && (
                            <button
                              onClick={() => {
                                setTab('hackathons');
                                setHackForm((prev) => ({
                                  ...prev,
                                  title: `${req.organization} Hackathon`,
                                  paymentDescription: `Registration for ${req.organization} event`
                                }));
                                setShowHackForm(true);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-sm flex items-center justify-center gap-2 transition"
                            >
                              <Plus className="w-4 h-4" /> Create Hackathon
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════ COUPONS TAB ══════════════ */}
        {tab === 'coupons' && (
          <div className="space-y-8">

            {/* Feedback banner */}
            {couponMsg.text && (
              <div className={`flex items-start gap-3 p-4 rounded-2xl border text-sm font-medium ${
                couponMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                {couponMsg.type === 'success'
                  ? <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />}
                <span>{couponMsg.text}</span>
                <button onClick={() => setCouponMsg({ type: '', text: '' })} className="ml-auto shrink-0"><X className="w-4 h-4" /></button>
              </div>
            )}

            {/* ── Create Coupon Form ── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-5">
                <Tag className="w-5 h-5 text-indigo-600" />
                Create Discount Coupon
              </h2>
              <form onSubmit={handleCreateCoupon} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* Code */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Coupon Code *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. SKILL20"
                      value={couponForm.code}
                      onChange={e => setCouponForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                      maxLength={30}
                      pattern="[A-Z0-9_-]+"
                      title="Only A-Z, 0-9, _ or - allowed"
                      className="border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-mono font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-400 uppercase"
                    />
                    <p className="text-xs text-slate-400">3–30 chars, A-Z / 0-9 / _ / -</p>
                  </div>

                  {/* Discount type */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Discount Type *</label>
                    <select
                      value={couponForm.discountType}
                      onChange={e => setCouponForm(p => ({ ...p, discountType: e.target.value }))}
                      className="border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      <option value="percentage">Percentage (%) off</option>
                      <option value="flat">Flat (₹) off</option>
                    </select>
                  </div>

                  {/* Discount value */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      {couponForm.discountType === 'percentage' ? 'Discount % (1–100) *' : 'Flat Discount ₹ *'}
                    </label>
                    <input
                      required
                      type="number"
                      min="1"
                      max={couponForm.discountType === 'percentage' ? 100 : 98}
                      step="0.01"
                      placeholder={couponForm.discountType === 'percentage' ? '20' : '30'}
                      value={couponForm.discountValue}
                      onChange={e => setCouponForm(p => ({ ...p, discountValue: e.target.value }))}
                      className="border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>

                  {/* Usage limit */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Usage Limit</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Leave blank for unlimited"
                      value={couponForm.maxUsageLimit}
                      onChange={e => setCouponForm(p => ({ ...p, maxUsageLimit: e.target.value }))}
                      className="border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>

                  {/* Valid from */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Valid From</label>
                    <input
                      type="datetime-local"
                      value={couponForm.validFrom}
                      onChange={e => setCouponForm(p => ({ ...p, validFrom: e.target.value }))}
                      className="border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>

                  {/* Valid until */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Valid Until (Expiry)</label>
                    <input
                      type="datetime-local"
                      value={couponForm.validUntil}
                      onChange={e => setCouponForm(p => ({ ...p, validUntil: e.target.value }))}
                      className="border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>

                  {/* Description – full width */}
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Internal Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Campus ambassador batch April 2026"
                      value={couponForm.description}
                      maxLength={200}
                      onChange={e => setCouponForm(p => ({ ...p, description: e.target.value }))}
                      className="border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                </div>

                {/* Preview line */}
                {couponForm.code && couponForm.discountValue && (
                  <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800 flex items-center gap-2">
                    <Percent className="w-4 h-4 shrink-0" />
                    <span>
                      <strong>{couponForm.code || '...'}</strong> — {couponForm.discountType === 'percentage'
                        ? `${couponForm.discountValue}% off → ₹${Math.max(1, Math.round(99 * (1 - couponForm.discountValue / 100)))}`
                        : `₹${couponForm.discountValue} off → ₹${Math.max(1, 99 - Number(couponForm.discountValue))}`}
                      {couponForm.maxUsageLimit ? ` · limit ${couponForm.maxUsageLimit} uses` : ' · unlimited uses'}
                      {couponForm.validUntil ? ` · expires ${new Date(couponForm.validUntil).toLocaleDateString('en-IN')}` : ''}
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={couponSaving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow transition disabled:opacity-60"
                >
                  {couponSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {couponSaving ? 'Creating...' : 'Create Coupon'}
                </button>
              </form>
            </div>

            {/* ── Coupon List ── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between gap-4 mb-5">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-indigo-600" />
                  All Coupons
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">{coupons.length}</span>
                </h2>
                <button
                  onClick={loadCoupons}
                  disabled={couponsLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${couponsLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              {couponsLoading && (
                <div className="space-y-3">
                  {[1,2,3].map(i => <div key={i} className="h-20 rounded-xl bg-slate-100 animate-pulse" />)}
                </div>
              )}

              {!couponsLoading && coupons.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
                  <Tag className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500 font-medium">No coupons created yet.</p>
                  <p className="text-xs text-slate-400 mt-1">Use the form above to create your first discount coupon.</p>
                </div>
              )}

              {!couponsLoading && coupons.length > 0 && (
                <div className="space-y-3">
                  {coupons.map(coupon => {
                    const isExpired = coupon.validUntil && new Date(coupon.validUntil) < new Date();
                    const isExhausted = coupon.maxUsageLimit !== null && coupon.usedCount >= coupon.maxUsageLimit;
                    const statusBadge = !coupon.isActive
                      ? { label: 'Inactive', cls: 'bg-slate-100 text-slate-600' }
                      : isExpired
                        ? { label: 'Expired', cls: 'bg-rose-100 text-rose-700' }
                        : isExhausted
                          ? { label: 'Exhausted', cls: 'bg-amber-100 text-amber-700' }
                          : { label: 'Active', cls: 'bg-emerald-100 text-emerald-700' };

                    return (
                      <div key={coupon._id} className="rounded-xl border border-slate-200 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">

                          {/* Left: code + badges */}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="font-black text-slate-900 text-base font-mono tracking-widest">{coupon.code}</span>
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${statusBadge.cls}`}>{statusBadge.label}</span>
                              <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                                {coupon.discountType === 'percentage' ? `${coupon.discountValue}% off` : `₹${coupon.discountValue} off`}
                              </span>
                            </div>
                            {coupon.description && (
                              <p className="text-xs text-slate-500 mb-1 truncate max-w-sm">{coupon.description}</p>
                            )}
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                              <span>Used: <strong className="text-slate-700">{coupon.usedCount}</strong>
                                {coupon.maxUsageLimit !== null ? ` / ${coupon.maxUsageLimit}` : ' / ∞'}
                              </span>
                              {coupon.validUntil && (
                                <span>Expires: <strong className={`${isExpired ? 'text-rose-600' : 'text-slate-700'}`}>
                                  {new Date(coupon.validUntil).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                                </strong></span>
                              )}
                              {coupon.validFrom && (
                                <span>From: <strong className="text-slate-700">
                                  {new Date(coupon.validFrom).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
                                </strong></span>
                              )}
                              <span>Created: <strong className="text-slate-700">{formatDate(coupon.createdAt)}</strong></span>
                            </div>
                          </div>

                          {/* Right: actions */}
                          <div className="flex items-center gap-2 shrink-0">
                            {/* Edit */}
                            <button
                              onClick={() => editingCouponId === coupon._id ? setEditingCouponId('') : handleStartEditCoupon(coupon)}
                              title="Edit coupon"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              {editingCouponId === coupon._id ? 'Cancel' : 'Edit'}
                            </button>

                            {/* Toggle active */}
                            <button
                              onClick={() => handleToggleCoupon(coupon._id)}
                              title={coupon.isActive ? 'Deactivate coupon' : 'Activate coupon'}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                coupon.isActive
                                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              {coupon.isActive
                                ? <ToggleRight className="w-4 h-4" />
                                : <ToggleLeft className="w-4 h-4" />}
                              {coupon.isActive ? 'Active' : 'Inactive'}
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteCoupon(coupon._id, coupon.code)}
                              disabled={deletingCouponId === coupon._id}
                              title="Delete coupon permanently"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition disabled:opacity-50"
                            >
                              {deletingCouponId === coupon._id
                                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                : <Trash2 className="w-3.5 h-3.5" />}
                              Delete
                            </button>
                          </div>
                        </div>

                        {/* ── Inline edit panel ── */}
                        {editingCouponId === coupon._id && (
                          <div className="mt-4 pt-4 border-t border-amber-200 bg-amber-50/60 rounded-xl p-4">
                            <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-3">Edit Coupon: {coupon.code}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Discount Type</label>
                                <select
                                  value={editCouponForm.discountType}
                                  onChange={e => setEditCouponForm(p => ({ ...p, discountType: e.target.value }))}
                                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                                >
                                  <option value="percentage">Percentage (%) off</option>
                                  <option value="flat">Flat (₹) off</option>
                                </select>
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                                  {editCouponForm.discountType === 'percentage' ? 'Discount %' : 'Flat ₹ off'}
                                </label>
                                <input
                                  type="number" min="1" step="0.01"
                                  value={editCouponForm.discountValue}
                                  onChange={e => setEditCouponForm(p => ({ ...p, discountValue: e.target.value }))}
                                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Usage Limit</label>
                                <input
                                  type="number" min="1" placeholder="Unlimited"
                                  value={editCouponForm.maxUsageLimit}
                                  onChange={e => setEditCouponForm(p => ({ ...p, maxUsageLimit: e.target.value }))}
                                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Valid Until (Expiry)</label>
                                <input
                                  type="datetime-local"
                                  value={editCouponForm.validUntil}
                                  onChange={e => setEditCouponForm(p => ({ ...p, validUntil: e.target.value }))}
                                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Valid From</label>
                                <input
                                  type="datetime-local"
                                  value={editCouponForm.validFrom}
                                  onChange={e => setEditCouponForm(p => ({ ...p, validFrom: e.target.value }))}
                                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Description</label>
                                <input
                                  type="text" maxLength={200} placeholder="Internal notes..."
                                  value={editCouponForm.description}
                                  onChange={e => setEditCouponForm(p => ({ ...p, description: e.target.value }))}
                                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <button
                                onClick={() => handleSaveEditCoupon(coupon._id)}
                                disabled={editCouponSaving}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow transition disabled:opacity-60"
                              >
                                {editCouponSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                                {editCouponSaving ? 'Saving...' : 'Save Changes'}
                              </button>
                              <button
                                onClick={() => setEditingCouponId('')}
                                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ══════════════ SIM COUPONS TAB ══════════════ */}
        {tab === 'sim-coupons' && (
          <div className="space-y-8">

            {/* Feedback banner */}
            {simCouponMsg.text && (
              <div className={`flex items-start gap-3 p-4 rounded-2xl border text-sm font-medium ${
                simCouponMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                {simCouponMsg.type === 'success'
                  ? <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />}
                <span>{simCouponMsg.text}</span>
                <button onClick={() => setSimCouponMsg({ type: '', text: '' })} className="ml-auto shrink-0"><X className="w-4 h-4" /></button>
              </div>
            )}

            {/* ── Create Coupon Form ── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-5">
                <Tag className="w-5 h-5 text-indigo-600" />
                Create Simulation Coupon
              </h2>
              <form onSubmit={handleCreateSimCoupon} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* Code */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Coupon Code *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. SKILL20"
                      value={simCouponForm.code}
                      onChange={e => setSimCouponForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                      maxLength={30}
                      pattern="[A-Z0-9_-]+"
                      title="Only A-Z, 0-9, _ or - allowed"
                      className="border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-mono font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-400 uppercase"
                    />
                    <p className="text-xs text-slate-400">3–30 chars, A-Z / 0-9 / _ / -</p>
                  </div>

                  {/* Discount type */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Discount Type *</label>
                    <select
                      value={simCouponForm.discountType}
                      onChange={e => setSimCouponForm(p => ({ ...p, discountType: e.target.value }))}
                      className="border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      <option value="percentage">Percentage (%) off</option>
                      <option value="flat">Flat (₹) off</option>
                    </select>
                  </div>

                  {/* Discount value */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      {simCouponForm.discountType === 'percentage' ? 'Discount % (1–100) *' : 'Flat Discount ₹ *'}
                    </label>
                    <input
                      required
                      type="number"
                      min="1"
                      max={simCouponForm.discountType === 'percentage' ? 100 : 98}
                      step="0.01"
                      placeholder={simCouponForm.discountType === 'percentage' ? '20' : '30'}
                      value={simCouponForm.discountValue}
                      onChange={e => setSimCouponForm(p => ({ ...p, discountValue: e.target.value }))}
                      className="border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>

                  {/* Sim IDs */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Simulation IDs</label>
                    <input
                      type="text"
                      placeholder="Comma separated IDs (leave empty for all)"
                      value={simCouponForm.simIds}
                      onChange={e => setSimCouponForm(p => ({ ...p, simIds: e.target.value }))}
                      className="border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>

                  {/* Usage limit */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Usage Limit</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Leave blank for unlimited"
                      value={simCouponForm.maxUsageLimit}
                      onChange={e => setSimCouponForm(p => ({ ...p, maxUsageLimit: e.target.value }))}
                      className="border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>

                  {/* Valid from */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Valid From</label>
                    <input
                      type="datetime-local"
                      value={simCouponForm.validFrom}
                      onChange={e => setSimCouponForm(p => ({ ...p, validFrom: e.target.value }))}
                      className="border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>

                  {/* Valid until */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Valid Until (Expiry)</label>
                    <input
                      type="datetime-local"
                      value={simCouponForm.validUntil}
                      onChange={e => setSimCouponForm(p => ({ ...p, validUntil: e.target.value }))}
                      className="border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>

                  {/* Description – full width */}
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Internal Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Campus ambassador batch April 2026"
                      value={simCouponForm.description}
                      maxLength={200}
                      onChange={e => setSimCouponForm(p => ({ ...p, description: e.target.value }))}
                      className="border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                </div>

                {/* Preview line */}
                {simCouponForm.code && simCouponForm.discountValue && (
                  <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800 flex items-center gap-2">
                    <Percent className="w-4 h-4 shrink-0" />
                    <span>
                      <strong>{simCouponForm.code || '...'}</strong> — {simCouponForm.discountType === 'percentage'
                        ? `${simCouponForm.discountValue}% off → ₹${Math.max(1, Math.round(99 * (1 - simCouponForm.discountValue / 100)))}`
                        : `₹${simCouponForm.discountValue} off → ₹${Math.max(1, 99 - Number(simCouponForm.discountValue))}`}
                      {simCouponForm.maxUsageLimit ? ` · limit ${simCouponForm.maxUsageLimit} uses` : ' · unlimited uses'}
                      {simCouponForm.validUntil ? ` · expires ${new Date(simCouponForm.validUntil).toLocaleDateString('en-IN')}` : ''}
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={simCouponSaving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow transition disabled:opacity-60"
                >
                  {simCouponSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {simCouponSaving ? 'Creating...' : 'Create Coupon'}
                </button>
              </form>
            </div>

            {/* ── Coupon List ── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between gap-4 mb-5">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-indigo-600" />
                  All Simulation Coupons
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">{simCoupons.length}</span>
                </h2>
                <button
                  onClick={loadSimCoupons}
                  disabled={simCouponsLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${simCouponsLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              {simCouponsLoading && (
                <div className="space-y-3">
                  {[1,2,3].map(i => <div key={i} className="h-20 rounded-xl bg-slate-100 animate-pulse" />)}
                </div>
              )}

              {!simCouponsLoading && simCoupons.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
                  <Tag className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500 font-medium">No simCoupons created yet.</p>
                  <p className="text-xs text-slate-400 mt-1">Use the form above to create your first discount simCoupon.</p>
                </div>
              )}

              {!simCouponsLoading && simCoupons.length > 0 && (
                <div className="space-y-3">
                  {simCoupons.map(simCoupon => {
                    const isExpired = simCoupon.validUntil && new Date(simCoupon.validUntil) < new Date();
                    const isExhausted = simCoupon.maxUsageLimit !== null && simCoupon.usedCount >= simCoupon.maxUsageLimit;
                    const statusBadge = !simCoupon.isActive
                      ? { label: 'Inactive', cls: 'bg-slate-100 text-slate-600' }
                      : isExpired
                        ? { label: 'Expired', cls: 'bg-rose-100 text-rose-700' }
                        : isExhausted
                          ? { label: 'Exhausted', cls: 'bg-amber-100 text-amber-700' }
                          : { label: 'Active', cls: 'bg-emerald-100 text-emerald-700' };

                    return (
                      <div key={simCoupon._id} className="rounded-xl border border-slate-200 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">

                          {/* Left: code + badges */}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="font-black text-slate-900 text-base font-mono tracking-widest">{simCoupon.code}</span>
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${statusBadge.cls}`}>{statusBadge.label}</span>
                              <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                                {simCoupon.discountType === 'percentage' ? `${simCoupon.discountValue}% off` : `₹${simCoupon.discountValue} off`}
                              </span>
                            </div>
                            {simCoupon.description && (
                              <p className="text-xs text-slate-500 mb-1 truncate max-w-sm">{simCoupon.description}</p>
                            )}
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                              <span>Used: <strong className="text-slate-700">{simCoupon.usedCount}</strong>
                                {simCoupon.maxUsageLimit !== null ? ` / ${simCoupon.maxUsageLimit}` : ' / ∞'}
                              </span>
                              {simCoupon.validUntil && (
                                <span>Expires: <strong className={`${isExpired ? 'text-rose-600' : 'text-slate-700'}`}>
                                  {new Date(simCoupon.validUntil).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                                </strong></span>
                              )}
                              {simCoupon.validFrom && (
                                <span>From: <strong className="text-slate-700">
                                  {new Date(simCoupon.validFrom).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
                                </strong></span>
                              )}
                              <span>Created: <strong className="text-slate-700">{formatDate(simCoupon.createdAt)}</strong></span>
                            </div>
                          </div>

                          {/* Right: actions */}
                          <div className="flex items-center gap-2 shrink-0">
                            {/* Edit */}
                            <button
                              onClick={() => editingSimCouponId === simCoupon._id ? setEditingSimCouponId('') : handleStartEditSimCoupon(simCoupon)}
                              title="Edit coupon"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              {editingSimCouponId === simCoupon._id ? 'Cancel' : 'Edit'}
                            </button>

                            {/* Toggle active */}
                            <button
                              onClick={() => handleToggleSimCoupon(simCoupon._id)}
                              title={simCoupon.isActive ? 'Deactivate coupon' : 'Activate coupon'}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                simCoupon.isActive
                                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              {simCoupon.isActive
                                ? <ToggleRight className="w-4 h-4" />
                                : <ToggleLeft className="w-4 h-4" />}
                              {simCoupon.isActive ? 'Active' : 'Inactive'}
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteSimCoupon(simCoupon._id, simCoupon.code)}
                              disabled={deletingSimCouponId === simCoupon._id}
                              title="Delete coupon permanently"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition disabled:opacity-50"
                            >
                              {deletingSimCouponId === simCoupon._id
                                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                : <Trash2 className="w-3.5 h-3.5" />}
                              Delete
                            </button>
                          </div>
                        </div>

                        {/* ── Inline edit panel ── */}
                        {editingSimCouponId === simCoupon._id && (
                          <div className="mt-4 pt-4 border-t border-amber-200 bg-amber-50/60 rounded-xl p-4">
                            <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-3">Edit Sim Coupon: {simCoupon.code}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Discount Type</label>
                                <select
                                  value={editSimCouponForm.discountType}
                                  onChange={e => setEditSimCouponForm(p => ({ ...p, discountType: e.target.value }))}
                                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                                >
                                  <option value="percentage">Percentage (%) off</option>
                                  <option value="flat">Flat (₹) off</option>
                                </select>
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                                  {editSimCouponForm.discountType === 'percentage' ? 'Discount %' : 'Flat ₹ off'}
                                </label>
                                <input
                                  type="number" min="1" step="0.01"
                                  value={editSimCouponForm.discountValue}
                                  onChange={e => setEditSimCouponForm(p => ({ ...p, discountValue: e.target.value }))}
                                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Usage Limit</label>
                                <input
                                  type="number" min="1" placeholder="Unlimited"
                                  value={editSimCouponForm.maxUsageLimit}
                                  onChange={e => setEditSimCouponForm(p => ({ ...p, maxUsageLimit: e.target.value }))}
                                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Valid Until (Expiry)</label>
                                <input
                                  type="datetime-local"
                                  value={editSimCouponForm.validUntil}
                                  onChange={e => setEditSimCouponForm(p => ({ ...p, validUntil: e.target.value }))}
                                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Valid From</label>
                                <input
                                  type="datetime-local"
                                  value={editSimCouponForm.validFrom}
                                  onChange={e => setEditSimCouponForm(p => ({ ...p, validFrom: e.target.value }))}
                                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Description</label>
                                <input
                                  type="text" maxLength={200} placeholder="Internal notes..."
                                  value={editSimCouponForm.description}
                                  onChange={e => setEditSimCouponForm(p => ({ ...p, description: e.target.value }))}
                                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <button
                                onClick={() => handleSaveEditSimCoupon(simCoupon._id)}
                                disabled={editSimCouponSaving}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow transition disabled:opacity-60"
                              >
                                {editSimCouponSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                                {editSimCouponSaving ? 'Saving...' : 'Save Changes'}
                              </button>
                              <button
                                onClick={() => setEditingSimCouponId('')}
                                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        

        {/* ══════════════ COURSE PRICING TAB ══════════════ */}
        {tab === 'pricing' && (
          <div className="space-y-8">

            {/* Feedback banner */}
            {priceMsg.text && (
              <div className={`flex items-start gap-3 p-4 rounded-2xl border text-sm font-medium ${
                priceMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                {priceMsg.type === 'success'
                  ? <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />}
                <span>{priceMsg.text}</span>
                <button onClick={() => setPriceMsg({ type: '', text: '' })} className="ml-auto shrink-0"><X className="w-4 h-4" /></button>
              </div>
            )}

            {/* Info card */}
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
                  <IndianRupee className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Course Exam Pricing</h2>
                  <p className="text-sm text-slate-600 mt-1 max-w-xl">
                    Set a custom price for each course's certification exam unlock. If no custom price is set,
                    the default of <strong>₹{defaultPricePaise / 100}</strong> applies.
                    Prices are validated server-side — students cannot bypass them.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 bg-white rounded-xl border border-indigo-200 px-3 py-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">System Default</span>
                      <span className="font-black text-indigo-700 text-lg">₹{defaultPricePaise / 100}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white rounded-xl border border-emerald-200 px-3 py-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Custom Prices Set</span>
                      <span className="font-black text-emerald-700 text-lg">{prices.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Course list with price controls */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-indigo-600" />
                  All Courses — Exam Prices
                </h2>
                <button
                  onClick={loadPrices}
                  disabled={pricesLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${pricesLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              {courses.length === 0 ? (
                <div className="text-center text-slate-400 py-12">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
                  <p className="text-sm">Loading courses...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {courses.map(course => {
                    const courseId = course._id;
                    const customPrice = prices.find(p => p.courseId === courseId);
                    const hasCustom = !!customPrice;
                    const isActive = customPrice?.isActive ?? false;
                    const displayPaise = hasCustom && isActive
                      ? customPrice.pricePaise
                      : defaultPricePaise;
                    const isEditing = courseId in priceEdits;
                    const isSaving = priceSaving === courseId;

                    return (
                      <div key={courseId} className={`rounded-xl border p-4 transition-all ${
                        hasCustom && isActive
                          ? 'border-indigo-200 bg-indigo-50/40'
                          : hasCustom && !isActive
                            ? 'border-slate-200 bg-slate-50 opacity-70'
                            : 'border-slate-200 bg-white'
                      }`}>
                        <div className="flex flex-wrap items-center justify-between gap-3">

                          {/* Left: course info + price badge */}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="font-bold text-slate-900 text-sm truncate max-w-xs">{course.title}</span>
                              {hasCustom && isActive && (
                                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">Custom</span>
                              )}
                              {hasCustom && !isActive && (
                                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-200 text-slate-500">Inactive</span>
                              )}
                              {!hasCustom && (
                                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Default</span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 font-mono mb-2">{courseId}</p>

                            {/* Current effective price */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500">Exam Price:</span>
                              <span className={`text-lg font-black ${hasCustom && isActive ? 'text-indigo-700' : 'text-slate-500'}`}>
                                ₹{displayPaise / 100}
                              </span>
                              {hasCustom && !isActive && (
                                <span className="text-xs text-slate-400">(inactive — defaulting to ₹{defaultPricePaise / 100})</span>
                              )}
                            </div>
                          </div>

                          {/* Right: edit controls */}
                          <div className="flex flex-wrap items-center gap-2 shrink-0">

                            {/* Price input + save */}
                            <div className="flex items-center gap-1.5">
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
                                <input
                                  type="number"
                                  min="1"
                                  step="0.01"
                                  placeholder={String(displayPaise / 100)}
                                  value={priceEdits[courseId] ?? ''}
                                  onChange={e => setPriceEdits(prev => ({ ...prev, [courseId]: e.target.value }))}
                                  className="w-28 pl-7 pr-3 py-1.5 border border-slate-300 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                              </div>
                              <button
                                onClick={() => handleSetPrice(courseId, course.title)}
                                disabled={isSaving || !priceEdits[courseId]}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition disabled:opacity-50"
                              >
                                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                                Set
                              </button>
                            </div>

                            {/* Toggle active (only if custom price exists) */}
                            {hasCustom && (
                              <button
                                onClick={() => handleTogglePrice(courseId)}
                                title={isActive ? 'Deactivate custom price (revert to default)' : 'Activate custom price'}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                                  isActive
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                {isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                                {isActive ? 'Active' : 'Inactive'}
                              </button>
                            )}

                            {/* Delete custom price */}
                            {hasCustom && (
                              <button
                                onClick={() => handleDeletePrice(courseId, course.title)}
                                title="Remove custom price (revert to default)"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Reset
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Preview when editing */}
                        {isEditing && priceEdits[courseId] && parseFloat(priceEdits[courseId]) > 0 && (
                          <div className="mt-3 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs text-indigo-800 flex items-center gap-2">
                            <IndianRupee className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              New price for <strong>{course.title}</strong>: <strong>₹{parseFloat(priceEdits[courseId])}</strong>
                              {' '}= ₹{Math.round(parseFloat(priceEdits[courseId]) * 100)} paise
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Custom prices summary */}
              {prices.length > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Custom Price Records in Database</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {prices.map(p => (
                      <div key={p._id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
                        <div className="min-w-0">
                          <span className="font-bold text-slate-800 truncate block">{p.courseTitle || p.courseId}</span>
                          <span className="text-slate-400 font-mono text-[10px]">{p.courseId}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`font-black text-sm ${p.isActive ? 'text-indigo-700' : 'text-slate-400'}`}>
                            ₹{p.pricePaise / 100}
                          </span>
                          <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded-full ${
                            p.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
                          }`}>
                            {p.isActive ? 'Active' : 'Off'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ─── JOB SIMULATIONS TAB ─── */}
        {tab === 'simulations' && (
          <div className="space-y-6">

            {/* Stats Modal */}
            {simStatsModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSimStatsModal(null)}>
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-violet-50">
                    <div>
                      <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-indigo-600" />
                        Simulation Analytics
                      </h3>
                      {simStatsModal.data && (
                        <p className="text-xs text-slate-500 mt-0.5">{simStatsModal.data.sim.title}</p>
                      )}
                    </div>
                    <button onClick={() => setSimStatsModal(null)} className="p-2 hover:bg-slate-100 rounded-lg transition">
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>

                  <div className="overflow-y-auto flex-1 p-6">
                    {simStatsLoading ? (
                      <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                      </div>
                    ) : simStatsModal.data ? (
                      <div className="space-y-6">
                        {/* Stats cards */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-4">
                            <p className="text-xs font-bold text-indigo-500 uppercase tracking-wide">Total Certs</p>
                            <p className="text-3xl font-black text-indigo-700 mt-2">{simStatsModal.data.totalCerts}</p>
                          </div>
                          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                            <p className="text-xs font-bold text-emerald-500 uppercase tracking-wide">Tasks Done</p>
                            <p className="text-3xl font-black text-emerald-700 mt-2">{simStatsModal.data.taskBreakdown.reduce((s, t) => s + t.count, 0)}</p>
                          </div>
                          <div className="rounded-xl bg-violet-50 border border-violet-100 p-4">
                            <p className="text-xs font-bold text-violet-500 uppercase tracking-wide">Recent Subs</p>
                            <p className="text-3xl font-black text-violet-700 mt-2">{simStatsModal.data.recentSubmissions.length}</p>
                          </div>
                        </div>

                        {/* Task breakdown */}
                        {simStatsModal.data.taskBreakdown.length > 0 && (
                          <div>
                            <h4 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Task Completion Breakdown</h4>
                            <div className="space-y-2">
                              {simStatsModal.data.taskBreakdown.map(t => (
                                <div key={t._id} className="flex items-center gap-3">
                                  <span className="text-xs font-bold text-slate-500 w-16 shrink-0">Task {t._id}</span>
                                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                                    <div
                                      className="bg-indigo-500 rounded-full h-2 transition-all"
                                      style={{ width: `${Math.min(100, (t.count / Math.max(...simStatsModal.data.taskBreakdown.map(x => x.count))) * 100)}%` }}
                                    />
                                  </div>
                                  <span className="text-xs font-bold text-slate-700 w-8 text-right shrink-0">{t.count}</span>
                                  <span className="text-xs text-slate-400 w-20 shrink-0">{t.taskType}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Recent submissions */}
                        {simStatsModal.data.recentSubmissions.length > 0 && (
                          <div>
                            <h4 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Recent Submissions</h4>
                            <div className="space-y-2 max-h-72 overflow-y-auto">
                              {simStatsModal.data.recentSubmissions.map((s, i) => (
                                <div key={i} className="rounded-lg border border-slate-200 p-3 flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-slate-900 truncate">{s.userName}</p>
                                    <p className="text-xs text-slate-500 truncate">{s.userEmail}</p>
                                    <p className="text-xs text-slate-400 mt-1">
                                      Task {s.taskNum} · {s.taskType} · {new Date(s.submittedAt).toLocaleDateString('en-IN')}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                                      s.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                    }`}>{s.status}</span>
                                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 transition">
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                    Job Simulation Manager
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Manage certificate prices, visibility, and view live analytics for all simulations. Price changes update the JSON file immediately.
                  </p>
                </div>
                <button
                  onClick={loadSimulations}
                  disabled={simsLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-sm font-semibold transition shrink-0"
                >
                  <RefreshCw className={`w-4 h-4 ${simsLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              {/* Security note */}
              <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
                <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
                <span>
                  <strong>Secure &amp; Safe:</strong> All changes are admin-only (JWT + role check). Price and visibility edits write atomically to the JSON file using a temp-file swap — no data loss on partial failures. Changes take effect on the next frontend request.
                </span>
              </div>

              {simMsg.text && (
                <div className={`mt-4 flex items-start gap-2 p-3 rounded-xl text-sm ${
                  simMsg.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-700'
                }`}>
                  {simMsg.type === 'success' ? <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />}
                  <span>{simMsg.text}</span>
                </div>
              )}
            </div>

            {/* Summary cards */}
            {!simsLoading && simulations.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Simulations', value: simulations.length, tone: 'from-indigo-600 to-blue-600' },
                  { label: 'Total Completions', value: simulations.reduce((s, sim) => s + sim.completionCount, 0), tone: 'from-emerald-600 to-teal-600' },
                  { label: 'Certs Issued', value: simulations.reduce((s, sim) => s + sim.certCount, 0), tone: 'from-amber-500 to-orange-500' },
                  { label: 'Active Sims', value: simulations.filter(s => !s.comingSoon).length, tone: 'from-violet-600 to-purple-600' },
                ].map(({ label, value, tone }) => (
                  <div key={label} className={`rounded-2xl bg-gradient-to-br ${tone} p-5 text-white shadow-lg`}>
                    <p className="text-xs uppercase tracking-widest font-bold text-white/70">{label}</p>
                    <p className="mt-3 text-4xl font-black leading-none">{value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Simulation cards */}
            {simsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1,2,3,4].map(i => <div key={i} className="h-64 rounded-2xl bg-slate-100 animate-pulse" />)}
              </div>
            ) : simulations.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
                <Briefcase className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="font-semibold">No simulations found</p>
                <p className="text-sm mt-1">Check that job-simulations.json is accessible on the backend.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {simulations.map(sim => {
                  const priceEdit = simPriceEdits[sim.id];
                  const isSavingPrice = simPriceSaving === sim.id;
                  const isToggling = simTogglingId === sim.id;

                  return (
                    <div key={sim.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      {/* Card header */}
                      <div className={`h-1.5 w-full bg-gradient-to-r ${sim.color || 'from-indigo-500 to-violet-500'}`} />
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-slate-900 text-sm leading-snug">{sim.title}</h3>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide ${
                                sim.comingSoon
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}>
                                {sim.comingSoon ? 'Hidden' : 'Live'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{sim.role}</p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">{sim.level}</span>
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">{sim.duration}</span>
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">{sim.taskCount} tasks</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleViewSimStats(sim.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition shrink-0"
                          >
                            <BarChart3 className="w-3.5 h-3.5" /> Stats
                          </button>
                        </div>

                        {/* Live stats row */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          <div className="rounded-lg bg-slate-50 border border-slate-100 p-2.5 text-center">
                            <p className="text-[10px] text-slate-400 font-semibold uppercase">Completions</p>
                            <p className="text-xl font-black text-slate-800 mt-0.5">{sim.completionCount}</p>
                          </div>
                          <div className="rounded-lg bg-slate-50 border border-slate-100 p-2.5 text-center">
                            <p className="text-[10px] text-slate-400 font-semibold uppercase">Certs</p>
                            <p className="text-xl font-black text-slate-800 mt-0.5">{sim.certCount}</p>
                          </div>
                          <div className="rounded-lg bg-slate-50 border border-slate-100 p-2.5 text-center">
                            <p className="text-[10px] text-slate-400 font-semibold uppercase">Active Users</p>
                            <p className="text-xl font-black text-slate-800 mt-0.5">{sim.uniqueActiveUsers}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                          {/* Price editor */}
                          <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                              Certificate Price (₹)
                            </label>
                            <div className="flex items-center gap-2">
                              <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                                <input
                                  type="number"
                                  min="1"
                                  max="100000"
                                  value={priceEdit !== undefined ? priceEdit : String(sim.certCost || '')}
                                  onChange={e => setSimPriceEdits(prev => ({ ...prev, [sim.id]: e.target.value }))}
                                  className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white"
                                  placeholder="e.g. 99"
                                />
                              </div>
                              <button
                                onClick={() => handleSimPriceSave(sim.id, sim.title)}
                                disabled={isSavingPrice || priceEdit === undefined || priceEdit === String(sim.certCost)}
                                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shrink-0"
                              >
                                {isSavingPrice ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                                Save
                              </button>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">Current: ₹{sim.certCost ?? 99}</p>
                          </div>

                          {/* Visibility toggle */}
                          <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <div>
                              <p className="text-xs font-bold text-slate-700">Visibility</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                {sim.comingSoon ? 'Currently hidden — shows Coming Soon badge' : 'Live and accessible to all users'}
                              </p>
                            </div>
                            <button
                              onClick={() => handleSimToggleVisibility(sim.id, sim.title)}
                              disabled={isToggling}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                sim.comingSoon
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                  : 'bg-amber-500 hover:bg-amber-600 text-white'
                              } disabled:opacity-60`}
                            >
                              {isToggling ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : sim.comingSoon ? (
                                <Globe className="w-3.5 h-3.5" />
                              ) : (
                                <EyeOff className="w-3.5 h-3.5" />
                              )}
                              {sim.comingSoon ? 'Make Live' : 'Hide'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Campus Ambassador Admin Tab ──────────────────────────────────────── */}
        {tab === 'ambassadors' && (
          <div className="space-y-6">
            {/* Header card */}
            <div className="bg-white rounded-2xl border-2 border-purple-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Campus Ambassador Program</h2>
                  <p className="text-slate-500 text-sm">Manage ambassadors, process reward requests, and quick-assign users.</p>
                </div>
              </div>
              {/* Sub-tabs */}
              <div className="flex gap-2 mt-5 flex-wrap">
                {[
                  { key: 'list', label: '📋 Ambassador List' },
                  { key: 'rewards', label: '🎁 Reward Requests' },
                  { key: 'assign', label: '⚡ Quick Assign' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setAmbSubTab(key)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                      ambSubTab === key
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── AMBASSADOR LIST ──────────────────────────────────────────── */}
            {ambSubTab === 'list' && (
              <div className="space-y-4">
                {/* Filters bar */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                  <div className="flex flex-wrap gap-3 items-center">
                    <div className="relative flex-1 min-w-48">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search name, email, college, location..."
                        value={ambSearch}
                        onChange={e => setAmbSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                      />
                    </div>
                    <select
                      value={ambStatusFilter}
                      onChange={e => setAmbStatusFilter(e.target.value)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
                    >
                      <option value="">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="suspended">Suspended</option>
                    </select>
                    <button
                      onClick={() => loadAmbList(ambSearch)}
                      className="px-4 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Refresh
                    </button>
                    <button
                      onClick={handleExportReport}
                      disabled={exportingReport}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" />
                      {exportingReport ? 'Exporting...' : 'Export Report'}
                    </button>
                  </div>
                </div>

                {/* Global message */}
                {ambMsg.text && (
                  <div className={`p-3 rounded-xl text-sm font-medium border ${
                    ambMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {ambMsg.text}
                  </div>
                )}

                {/* Ambassador cards */}
                {ambListLoading ? (
                  <div className="flex items-center justify-center py-14">
                    <Loader2 className="w-7 h-7 animate-spin text-purple-500" />
                  </div>
                ) : ambList.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-400 text-sm">
                    No ambassador records found.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {ambList.map(amb => (
                      <div key={amb._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-purple-200 transition-colors">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          {/* Left: info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <p className="font-bold text-slate-800">{amb.user?.name || 'Unknown'}</p>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                                amb.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                amb.status === 'pending'  ? 'bg-yellow-100 text-yellow-700' :
                                amb.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                'bg-orange-100 text-orange-700'
                              }`}>
                                {amb.status}
                              </span>
                              {amb.referralCode && (
                                <span className="px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700 font-mono">
                                  {amb.referralCode}
                                </span>
                              )}
                            </div>
                            <p className="text-slate-500 text-xs">{amb.user?.email}</p>
                            <p className="text-slate-600 text-xs mt-1">
                              🏫 {amb.college || '—'}&nbsp;·&nbsp;📍 {amb.location || '—'}
                              {amb.mobile && <>&nbsp;·&nbsp;📱 {amb.mobile}</>}
                            </p>
                            {amb.whyJoin && (
                              <p className="text-slate-400 text-xs mt-1 italic line-clamp-2">&ldquo;{amb.whyJoin}&rdquo;</p>
                            )}
                            <p className="text-purple-700 text-xs font-bold mt-1.5 flex items-center gap-2 flex-wrap">
                              <span>⭐ {(amb.totalPoints || 0).toLocaleString()} SV pts</span>
                              <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full font-bold">
                                {amb.level?.name || 'Explorer'} ({amb.level?.effectiveRevenueShare}% Rev Share)
                              </span>
                              {amb.claimedMilestones?.length > 0 && (
                                <span className="text-amber-600">· Claimed: {amb.claimedMilestones.join(', ')}</span>
                              )}
                            </p>

                            {/* Level Override & Custom RevShare Controls */}
                            <div className="flex flex-wrap gap-2 items-center mt-2 pt-2 border-t border-slate-100 text-xs">
                              <div className="flex items-center gap-1">
                                <span className="text-slate-400 font-semibold">Override Level:</span>
                                <select
                                  value={amb.levelOverride || ''}
                                  onChange={e => handleOverrideLevel(amb._id, e.target.value)}
                                  className="px-2 py-1 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none"
                                >
                                  <option value="">(Default Level)</option>
                                  <option value="explorer">🌱 Explorer</option>
                                  <option value="bronze">🥉 Bronze</option>
                                  <option value="silver">🥈 Silver</option>
                                  <option value="gold">🥇 Gold</option>
                                  <option value="platinum">💎 Platinum</option>
                                </select>
                              </div>

                              <div className="flex items-center gap-1">
                                <span className="text-slate-400 font-semibold">Platinum Rev Share %:</span>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  placeholder={String(amb.level?.effectiveRevenueShare || 7)}
                                  defaultValue={amb.customRevenueShare ?? ''}
                                  onBlur={e => handleOverrideRevShare(amb._id, e.target.value)}
                                  className="w-16 px-2 py-1 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none"
                                />
                              </div>
                            </div>

                            {amb.adminNote && (
                              <p className="text-slate-400 text-xs mt-0.5">Admin note: {amb.adminNote}</p>
                            )}
                            <p className="text-slate-300 text-xs mt-1">
                              Applied {formatDate(amb.createdAt)}
                              {amb.approvedAt && <> · Approved {formatDate(amb.approvedAt)}</>}
                            </p>
                          </div>

                          {/* Right: actions */}
                          <div className="flex flex-col gap-2 min-w-48">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => setAdjustModalAmb(amb)}
                                className="flex-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1"
                              >
                                ⚡ Adjust Points
                              </button>
                              <button
                                onClick={() => handleViewHistory(amb)}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1"
                                title="View Point Audit Log"
                              >
                                📜 Logs
                              </button>
                            </div>

                            <input
                              type="text"
                              placeholder="Admin note (optional)"
                              value={ambNoteInputs[amb._id] || ''}
                              onChange={e => setAmbNoteInputs(prev => ({ ...prev, [amb._id]: e.target.value }))}
                              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs w-full focus:outline-none focus:ring-1 focus:ring-purple-300"
                            />
                            <div className="flex gap-1.5 flex-wrap">
                              {amb.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleAmbApprove(amb._id)}
                                    disabled={ambActingId === amb._id}
                                    className="flex-1 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors disabled:opacity-60"
                                  >
                                    {ambActingId === amb._id
                                      ? <Loader2 className="w-3 h-3 animate-spin" />
                                      : <CheckCircle className="w-3 h-3" />}
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleAmbReject(amb._id)}
                                    disabled={ambActingId === amb._id}
                                    className="flex-1 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors disabled:opacity-60"
                                  >
                                    <X className="w-3 h-3" />
                                    Reject
                                  </button>
                                </>
                              )}
                              {amb.status === 'approved' && (
                                <button
                                  onClick={() => handleAmbSuspend(amb._id)}
                                  disabled={ambActingId === amb._id}
                                  className="flex-1 px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors disabled:opacity-60"
                                >
                                  {ambActingId === amb._id && <Loader2 className="w-3 h-3 animate-spin" />}
                                  Suspend
                                </button>
                              )}
                              {(amb.status === 'rejected' || amb.status === 'suspended') && (
                                <button
                                  onClick={() => handleAmbReactivate(amb._id)}
                                  disabled={ambActingId === amb._id}
                                  className="flex-1 px-3 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors disabled:opacity-60"
                                >
                                  {ambActingId === amb._id && <Loader2 className="w-3 h-3 animate-spin" />}
                                  Reactivate
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── REWARD REQUESTS ──────────────────────────────────────────── */}
            {ambSubTab === 'rewards' && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-wrap gap-3 items-center">
                  <select
                    value={rewardReqFilter}
                    onChange={e => setRewardReqFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
                  >
                    <option value="">All Requests</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button
                    onClick={loadRewardRequests}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                  <p className="text-slate-400 text-xs ml-auto">{rewardRequests.length} request(s)</p>
                </div>

                {rewardMsg.text && (
                  <div className={`p-3 rounded-xl text-sm font-medium border ${
                    rewardMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {rewardMsg.text}
                  </div>
                )}

                {rewardRequestsLoading ? (
                  <div className="flex items-center justify-center py-14">
                    <Loader2 className="w-7 h-7 animate-spin text-purple-500" />
                  </div>
                ) : rewardRequests.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-400 text-sm">
                    No reward requests found.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {rewardRequests.map(req => {
                      const amb = req.ambassadorId;
                      const tierEmoji = { bronze: '🥉', silver: '🥈', gold: '🥇', platinum: '💎' }[req.tier] || '🎁';
                      const tierCard = {
                        bronze: 'bg-amber-50 border-amber-200',
                        silver: 'bg-slate-50 border-slate-300',
                        gold:   'bg-yellow-50 border-yellow-300',
                        platinum: 'bg-cyan-50 border-cyan-300',
                      }[req.tier] || 'bg-white border-slate-200';
                      return (
                        <div key={req._id} className={`rounded-2xl border-2 p-5 ${tierCard}`}>
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-2xl">{tierEmoji}</span>
                                <p className="font-bold text-base capitalize">{req.tier} Reward</p>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase ${
                                  req.status === 'requested' || req.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' :
                                  req.status === 'approved' ? 'bg-teal-100 text-teal-700 border border-teal-300' :
                                  req.status === 'claimed'  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' :
                                  'bg-red-100 text-red-700 border border-red-300'
                                }`}>
                                  {req.status}
                                </span>
                              </div>
                              <p className="text-sm font-semibold text-slate-800">
                                {amb?.userId?.name}
                                <span className="text-slate-500 font-normal ml-1">({amb?.userId?.email})</span>
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5">
                                🏫 {amb?.college} · 📍 {amb?.location}
                              </p>
                              <p className="text-xs text-slate-600 mt-1">
                                Points at request: <strong>{(req.pointsAtRequest || 0).toLocaleString()}</strong>
                                &nbsp;·&nbsp;Current: <strong>{(amb?.totalPoints || 0).toLocaleString()}</strong>
                              </p>
                              <p className="text-xs text-slate-400 mt-0.5">Requested: {formatDate(req.createdAt)}</p>
                              {req.adminNote && (
                                <p className="text-xs text-slate-500 mt-1 italic">Admin note: {req.adminNote}</p>
                              )}
                            </div>

                            <div className="flex flex-col gap-2 min-w-48">
                              <input
                                type="text"
                                placeholder="Admin note (optional)"
                                value={rewardNoteInputs[req._id] || ''}
                                onChange={e => setRewardNoteInputs(prev => ({ ...prev, [req._id]: e.target.value }))}
                                className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs w-full focus:outline-none focus:ring-1 focus:ring-purple-300 bg-white"
                              />
                              <div className="flex gap-1.5 flex-wrap">
                                {req.status !== 'approved' && req.status !== 'claimed' && (
                                  <button
                                    onClick={() => handleUpdateRewardStatus(req._id, 'approved')}
                                    disabled={rewardActingId === req._id}
                                    className="flex-1 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors disabled:opacity-60"
                                  >
                                    Approve
                                  </button>
                                )}
                                {req.status !== 'claimed' && (
                                  <button
                                    onClick={() => handleUpdateRewardStatus(req._id, 'claimed')}
                                    disabled={rewardActingId === req._id}
                                    className="flex-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors disabled:opacity-60"
                                  >
                                    Mark Claimed
                                  </button>
                                )}
                                {req.status !== 'rejected' && (
                                  <button
                                    onClick={() => handleUpdateRewardStatus(req._id, 'rejected')}
                                    disabled={rewardActingId === req._id}
                                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors disabled:opacity-60"
                                  >
                                    Reject
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── QUICK ASSIGN ──────────────────────────────────────────────── */}
            {ambSubTab === 'assign' && (
              <div className="space-y-6">
                {/* Assign by user ID */}
                <div className="bg-white rounded-2xl border-2 border-purple-100 shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <Crown className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-slate-800">Assign Ambassador by User ID</h3>
                  </div>
                  <p className="text-slate-500 text-sm mb-4">
                    Enter a MongoDB User <strong>_id</strong> (24-char hex) to instantly approve any registered user as a Campus Ambassador — bypassing the application form.
                    A unique referral code will be generated automatically. Use the <strong>User Tracker</strong> tab to find user IDs.
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    <input
                      type="text"
                      placeholder="e.g. 64f3b2c1a9e1234567890abc"
                      value={ambApproveUserId}
                      onChange={e => setAmbApproveUserId(e.target.value)}
                      className="flex-1 min-w-56 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-300"
                    />
                    <button
                      onClick={handleAmbAssignByUserId}
                      disabled={ambApproving || !ambApproveUserId.trim()}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                      {ambApproving
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Crown className="w-4 h-4" />}
                      Assign Ambassador
                    </button>
                  </div>
                  {ambApproveMsg.text && (
                    <div className={`mt-3 p-3 rounded-xl text-sm font-medium border ${
                      ambApproveMsg.type === 'success'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {ambApproveMsg.text}
                    </div>
                  )}
                </div>

                {/* Summary stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Active Ambassadors', value: ambList.filter(a => a.status === 'approved').length, bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', sub: 'text-emerald-600' },
                    { label: 'Pending Review', value: ambList.filter(a => a.status === 'pending').length, bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', sub: 'text-yellow-600' },
                    { label: 'Suspended', value: ambList.filter(a => a.status === 'suspended').length, bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', sub: 'text-orange-600' },
                    { label: 'Total Points Awarded', value: ambList.reduce((s, a) => s + (a.totalPoints || 0), 0).toLocaleString(), bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', sub: 'text-purple-600' },
                  ].map(({ label, value, bg, border, text, sub }) => (
                    <div key={label} className={`${bg} border ${border} rounded-2xl p-5 text-center`}>
                      <p className={`text-3xl font-extrabold ${text}`}>{value}</p>
                      <p className={`text-xs font-medium ${sub} mt-1`}>{label}</p>
                    </div>
                  ))}
                </div>

                <p className="text-slate-400 text-xs text-center">
                  Counts above are based on the currently loaded ambassador list. Switch to "Ambassador List" tab and hit Refresh for the latest data.
                </p>
              </div>
            )}

            {/* Adjust Points Modal */}
            {adjustModalAmb && (
              <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                      <Zap className="w-5 h-5 text-indigo-600" />
                      Adjust Ambassador Points
                    </h3>
                    <button onClick={() => setAdjustModalAmb(null)} className="text-slate-400 hover:text-slate-600">✕</button>
                  </div>

                  <p className="text-xs text-slate-500">
                    Adjust SV points for <strong>{adjustModalAmb.user?.name}</strong> ({adjustModalAmb.college}).
                    Current total: <strong>{adjustModalAmb.totalPoints || 0} pts</strong>.
                  </p>

                  <form onSubmit={handleAdjustPointsSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Points (+ / -) *
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. +50 or -20"
                        value={adjustPointsVal}
                        onChange={e => setAdjustPointsVal(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Mandatory Reason / Description *
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="State reason for manual point addition or deduction..."
                        value={adjustReason}
                        onChange={e => setAdjustReason(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setAdjustModalAmb(null)}
                        className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={adjustingPoints || !adjustPointsVal || !adjustReason.trim()}
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md disabled:opacity-50"
                      >
                        {adjustingPoints ? 'Saving...' : 'Save Point Adjustment'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Point History Log Modal */}
            {historyModalAmb && (
              <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                        <Clock className="w-5 h-5 text-indigo-600" />
                        Point History Audit Trail
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Ambassador: {historyModalAmb.user?.name} ({historyModalAmb.college})
                      </p>
                    </div>
                    <button onClick={() => setHistoryModalAmb(null)} className="text-slate-400 hover:text-slate-600">✕</button>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                    {loadingHistory ? (
                      <div className="py-12 text-center text-slate-400 text-sm">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                        Loading point history...
                      </div>
                    ) : historyLogs.length === 0 ? (
                      <div className="py-12 text-center text-slate-400 text-sm">
                        No point audit records found.
                      </div>
                    ) : (
                      historyLogs.map(log => (
                        <div key={log._id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-slate-800">{log.description || log.eventType}</p>
                            <span className="text-[10px] text-slate-400">
                              {new Date(log.date || log.createdAt).toLocaleString('en-IN')} • Added by: {log.addedBy}
                            </span>
                          </div>
                          <span className={`font-black text-sm ${log.points > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {log.points > 0 ? `+${log.points}` : log.points} pts
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPanel;

