"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Image as ImageIcon,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Edit3,
  Copy,
  Check,
  Folder,
  FolderOpen,
  Eye,
  FileImage,
  RefreshCw,
  ExternalLink,
  Video,
  Film,
  Sparkles,
  Info,
} from "lucide-react";

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  sizeInBytes: number;
  altText?: string | null;
  folder: string;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
  metadata?: any;
  createdAt: string;
}

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = React.useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedFolder, setSelectedFolder] = React.useState("all");
  const [selectedType, setSelectedType] = React.useState<"all" | "image" | "video">("all");

  // Add Asset Modal
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [newAsset, setNewAsset] = React.useState({
    filename: "",
    url: "",
    folder: "products",
    altText: "",
    mimeType: "image/jpeg",
    sizeInBytes: 1500000,
    width: 1920,
    height: 1080,
    duration: 0,
  });

  // Preview & Edit Asset Modal
  const [selectedAsset, setSelectedAsset] = React.useState<MediaItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [editAltText, setEditAltText] = React.useState("");
  const [editFolder, setEditFolder] = React.useState("");
  const [isCopied, setIsCopied] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const [notification, setNotification] = React.useState<string | null>(null);

  const folders = [
    { id: "all", name: "All Vault Assets" },
    { id: "products", name: "Timepieces & Scents" },
    { id: "collections", name: "Collections & Lines" },
    { id: "journal", name: "Editorial & Chronicles" },
    { id: "branding", name: "Brand & Hallmarks" },
    { id: "banners", name: "Hero Banners" },
  ];

  const fetchMedia = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedFolder !== "all") params.append("folder", selectedFolder);
      if (selectedType !== "all") params.append("type", selectedType);
      if (searchTerm) params.append("search", searchTerm);

      const res = await fetch(`/api/admin/media?${params.toString()}`);
      const json = await res.json();
      if (json.success && json.media) {
        setMediaList(json.media);
      }
    } catch (err) {
      console.error("Media fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedFolder, selectedType, searchTerm]);

  React.useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleOpenAdd = () => {
    setNewAsset({
      filename: `velora-asset-${Date.now().toString().slice(-4)}.jpg`,
      url: "",
      folder: selectedFolder === "all" ? "products" : selectedFolder,
      altText: "",
      mimeType: "image/jpeg",
      sizeInBytes: 1500000,
      width: 1920,
      height: 1080,
      duration: 0,
    });
    setIsAddOpen(true);
  };

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.url || !newAsset.filename) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAsset),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to add asset");

      setNotification(`Asset "${newAsset.filename}" added to media library.`);
      setTimeout(() => setNotification(null), 3500);
      setIsAddOpen(false);
      fetchMedia();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error saving asset");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenPreview = (item: MediaItem) => {
    setSelectedAsset(item);
    setEditAltText(item.altText || "");
    setEditFolder(item.folder);
    setIsCopied(false);
    setIsPreviewOpen(true);
  };

  const handleSavePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/media/${selectedAsset.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          altText: editAltText,
          folder: editFolder,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to update asset");

      setNotification("Asset metadata saved.");
      setTimeout(() => setNotification(null), 3500);
      setIsPreviewOpen(false);
      fetchMedia();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error updating asset");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete asset "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete asset");

      setNotification("Asset deleted.");
      setTimeout(() => setNotification(null), 3500);
      setIsPreviewOpen(false);
      fetchMedia();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error deleting asset");
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white flex items-center gap-3">
            <ImageIcon className="h-8 w-8 text-gold" />
            Media & Cinematic Asset Vault
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Organize ultra-resolution photography, macro videos, campaign reels, and visual assets across curated folders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => fetchMedia()}
            className="border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={handleOpenAdd}
            className="bg-gold hover:bg-gold-light text-black font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Media Asset
          </Button>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg flex items-center gap-3 text-sm animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Folders & Type Filters & Search */}
      <div className="space-y-4">
        {/* Type Filter Tabs */}
        <div className="flex items-center gap-2">
          {[
            { id: "all", label: "All Media", icon: FileImage },
            { id: "image", label: "Photography & Images", icon: ImageIcon },
            { id: "video", label: "Cinematic Videos", icon: Video },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedType === t.id
                    ? "bg-gold text-black font-semibold shadow-sm"
                    : "bg-neutral-900/60 text-neutral-400 hover:text-white border border-neutral-800"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Folder pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {folders.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFolder(f.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  selectedFolder === f.id
                    ? "bg-white/20 text-white font-medium border border-gold/40 shadow-sm"
                    : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
                }`}
              >
                {selectedFolder === f.id ? (
                  <FolderOpen className="h-3.5 w-3.5 text-gold" />
                ) : (
                  <Folder className="h-3.5 w-3.5 text-neutral-500" />
                )}
                {f.name}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-72 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search filename or alt text..."
              className="pl-9 bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-gold/50 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {isLoading ? (
          Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl border border-white/5 bg-neutral-950/60 p-2 space-y-2">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
          ))
        ) : mediaList.length === 0 ? (
          <div className="col-span-full p-12 text-center text-neutral-500 rounded-xl border border-white/5 bg-neutral-950/40">
            No media assets found in this folder. Click "Add Media Asset" to register photography or reels.
          </div>
        ) : (
          mediaList.map((item) => {
            const isVideo = item.mimeType?.startsWith("video/") || item.url.endsWith(".mp4") || item.url.endsWith(".webm");
            return (
              <div
                key={item.id}
                onClick={() => handleOpenPreview(item)}
                className="group relative aspect-square rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md overflow-hidden cursor-pointer hover:border-gold/40 transition-all flex flex-col justify-end"
              >
                {isVideo ? (
                  <div className="absolute inset-0 w-full h-full bg-neutral-900 flex items-center justify-center">
                    <video
                      src={item.url}
                      muted
                      playsInline
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Film className="h-8 w-8 text-gold drop-shadow-lg" />
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.altText || item.filename}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-black/70 backdrop-blur-md text-gold border border-white/10">
                    {item.folder}
                  </span>
                  {isVideo && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <Video className="h-2.5 w-2.5" />
                      <span>{item.duration ? `${item.duration}s` : "Video"}</span>
                    </span>
                  )}
                </div>

                {/* File Info */}
                <div className="relative p-2.5 space-y-0.5">
                  <div className="text-white text-xs font-medium truncate group-hover:text-gold transition-colors">
                    {item.filename}
                  </div>
                  <div className="text-[10px] text-neutral-400 flex items-center justify-between">
                    <span>{formatFileSize(item.sizeInBytes)}</span>
                    <span>{item.width && item.height ? `${item.width}×${item.height}` : isVideo ? "Video" : "Image"}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Media Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <div className="p-6 space-y-6 max-w-lg">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-light text-white">Add Vault Media Asset</h2>
              <p className="text-xs text-neutral-400 mt-1">
                Register luxury photography URL, CDN video reel, or brand collateral.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateAsset} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Asset URL (Image or MP4 Video) *
              </label>
              <Input
                value={newAsset.url}
                onChange={(e) => {
                  const url = e.target.value;
                  const isVid = url.endsWith(".mp4") || url.endsWith(".webm") || url.includes("/video");
                  setNewAsset({
                    ...newAsset,
                    url,
                    mimeType: isVid ? "video/mp4" : "image/jpeg",
                  });
                }}
                placeholder="https://images.unsplash.com/... or https://assets.../reel.mp4"
                required
                className="bg-neutral-900 border-neutral-800 text-white font-mono text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Filename *
                </label>
                <Input
                  value={newAsset.filename}
                  onChange={(e) => setNewAsset({ ...newAsset, filename: e.target.value })}
                  placeholder="watch-dial-macro.jpg"
                  required
                  className="bg-neutral-900 border-neutral-800 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Vault Folder
                </label>
                <select
                  value={newAsset.folder}
                  onChange={(e) => setNewAsset({ ...newAsset, folder: e.target.value })}
                  className="w-full h-10 px-3 rounded-md bg-neutral-900 border border-neutral-800 text-white text-xs focus:ring-1 focus:ring-gold"
                >
                  <option value="products">Timepieces & Scents</option>
                  <option value="collections">Collections & Lines</option>
                  <option value="journal">Editorial & Chronicles</option>
                  <option value="branding">Brand & Hallmarks</option>
                  <option value="banners">Hero Banners</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  MIME Type
                </label>
                <select
                  value={newAsset.mimeType}
                  onChange={(e) => setNewAsset({ ...newAsset, mimeType: e.target.value })}
                  className="w-full h-10 px-3 rounded-md bg-neutral-900 border border-neutral-800 text-white text-xs focus:ring-1 focus:ring-gold"
                >
                  <option value="image/jpeg">image/jpeg</option>
                  <option value="image/png">image/png</option>
                  <option value="image/webp">image/webp</option>
                  <option value="video/mp4">video/mp4</option>
                  <option value="video/webm">video/webm</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Duration (Seconds, for Video)
                </label>
                <Input
                  type="number"
                  value={newAsset.duration || 0}
                  onChange={(e) => setNewAsset({ ...newAsset, duration: Number(e.target.value) })}
                  className="bg-neutral-900 border-neutral-800 text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Accessibility Alt Text (SEO)
              </label>
              <textarea
                value={newAsset.altText}
                onChange={(e) => setNewAsset({ ...newAsset, altText: e.target.value })}
                placeholder="High precision description of the subject for screen readers and search engines..."
                rows={2}
                className="w-full p-2.5 rounded-md bg-neutral-900 border border-neutral-800 text-white text-xs focus:ring-1 focus:ring-gold"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsAddOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gold hover:bg-gold-light text-black font-medium"
              >
                {isSubmitting ? "Adding..." : "Add to Vault"}
              </Button>
            </div>
          </form>
        </div>
      </Dialog>

      {/* Preview & Edit Modal */}
      {selectedAsset && (
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <div className="p-6 space-y-6 max-w-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-light text-white truncate max-w-md">
                  {selectedAsset.filename}
                </h2>
                <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1 font-mono">
                  <span>{selectedAsset.mimeType}</span>
                  <span>•</span>
                  <span>{formatFileSize(selectedAsset.sizeInBytes)}</span>
                  {selectedAsset.width && selectedAsset.height && (
                    <>
                      <span>•</span>
                      <span>{selectedAsset.width} × {selectedAsset.height} px</span>
                    </>
                  )}
                  {selectedAsset.duration && (
                    <>
                      <span>•</span>
                      <span>{selectedAsset.duration}s video</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Media Preview Box */}
            <div className="relative rounded-xl overflow-hidden bg-black border border-white/10 flex items-center justify-center min-h-[220px]">
              {selectedAsset.mimeType.startsWith("video/") || selectedAsset.url.endsWith(".mp4") ? (
                <video
                  src={selectedAsset.url}
                  controls
                  autoPlay
                  muted
                  playsInline
                  className="max-h-[380px] w-full rounded-lg object-contain bg-black"
                />
              ) : (
                <img
                  src={selectedAsset.url}
                  alt={selectedAsset.altText || selectedAsset.filename}
                  className="max-h-[380px] w-full object-contain rounded-lg"
                />
              )}
            </div>

            {/* URL Copy Bar */}
            <div className="flex items-center gap-2 bg-neutral-900/60 p-2 rounded-lg border border-neutral-800">
              <span className="text-xs font-mono text-neutral-400 truncate flex-1 pl-2">
                {selectedAsset.url}
              </span>
              <Button
                size="sm"
                onClick={() => copyUrl(selectedAsset.url)}
                className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs shrink-0"
              >
                {isCopied ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                {isCopied ? "Copied" : "Copy URL"}
              </Button>
            </div>

            {/* Metadata Inspector Card */}
            {selectedAsset.metadata && (
              <div className="p-3.5 rounded-lg bg-neutral-900/40 border border-white/5 space-y-1 text-xs">
                <span className="text-[10px] uppercase font-mono tracking-wider text-gold flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5" />
                  Asset Metadata Inspector
                </span>
                <pre className="text-[11px] font-mono text-neutral-300 whitespace-pre-wrap overflow-x-auto pt-1">
                  {JSON.stringify(selectedAsset.metadata, null, 2)}
                </pre>
              </div>
            )}

            {/* Edit Form */}
            <form onSubmit={handleSavePreview} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Alt Text (SEO & Accessibility)
                </label>
                <textarea
                  value={editAltText}
                  onChange={(e) => setEditAltText(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-md bg-neutral-900 border border-neutral-800 text-white text-xs focus:ring-1 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Folder Destination
                </label>
                <select
                  value={editFolder}
                  onChange={(e) => setEditFolder(e.target.value)}
                  className="w-full h-10 px-3 rounded-md bg-neutral-900 border border-neutral-800 text-white text-xs focus:ring-1 focus:ring-gold"
                >
                  <option value="products">Timepieces & Scents</option>
                  <option value="collections">Collections & Lines</option>
                  <option value="journal">Editorial & Chronicles</option>
                  <option value="branding">Brand & Hallmarks</option>
                  <option value="banners">Hero Banners</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleDelete(selectedAsset.id, selectedAsset.filename)}
                  className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 text-xs"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Asset
                </Button>

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsPreviewOpen(false)}
                    className="text-neutral-400 hover:text-white"
                  >
                    Close
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="bg-gold hover:bg-gold-light text-black font-medium text-xs px-5"
                  >
                    {isUpdating ? "Saving..." : "Save Metadata"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </Dialog>
      )}
    </div>
  );
}
