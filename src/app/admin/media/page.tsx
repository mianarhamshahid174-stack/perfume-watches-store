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
} from "lucide-react";

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  sizeInBytes: number;
  altText?: string | null;
  folder: string;
  createdAt: string;
}

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = React.useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedFolder, setSelectedFolder] = React.useState("all");

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
  }, [selectedFolder, searchTerm]);

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

      setNotification("Asset metadata updated.");
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
    if (!confirm(`Delete asset "${name}" permanently?`)) return;
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete");

      setNotification("Asset removed from library.");
      setTimeout(() => setNotification(null), 3500);
      setIsPreviewOpen(false);
      fetchMedia();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error deleting asset");
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white flex items-center gap-3">
            <ImageIcon className="h-8 w-8 text-gold" />
            Media & Asset Vault
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Organize high-resolution horological imagery, campaign banners, and visual assets across folders.
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

      {/* Folders & Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Folder pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {folders.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFolder(f.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                selectedFolder === f.id
                  ? "bg-gold text-black shadow-sm"
                  : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
              }`}
            >
              {selectedFolder === f.id ? (
                <FolderOpen className="h-3.5 w-3.5" />
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
            No media assets found in this folder. Click "Add Media Asset" to register photography or graphics.
          </div>
        ) : (
          mediaList.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenPreview(item)}
              className="group relative aspect-square rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md overflow-hidden cursor-pointer hover:border-gold/40 transition-all flex flex-col justify-end"
            >
              <img
                src={item.url}
                alt={item.altText || item.filename}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              {/* Folder badge */}
              <div className="absolute top-2 left-2">
                <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-black/60 backdrop-blur-md text-gold border border-white/10">
                  {item.folder}
                </span>
              </div>

              {/* File Info */}
              <div className="relative p-2.5 space-y-0.5">
                <div className="text-white text-xs font-medium truncate group-hover:text-gold transition-colors">
                  {item.filename}
                </div>
                <div className="text-[10px] text-neutral-400 flex items-center justify-between">
                  <span>{formatFileSize(item.sizeInBytes)}</span>
                  <span>{item.altText ? "Has Alt" : "No Alt"}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Media Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <div className="p-6 space-y-6 max-w-lg">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-light text-white">Add Vault Media Asset</h2>
              <p className="text-xs text-neutral-400 mt-1">
                Register luxury photography URL, CDN asset, or brand collateral.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateAsset} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Asset Image URL *
              </label>
              <Input
                value={newAsset.url}
                onChange={(e) => setNewAsset({ ...newAsset, url: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
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
                  placeholder="timepiece-macro-dial.jpg"
                  required
                  className="bg-neutral-900 border-neutral-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Target Folder *
                </label>
                <select
                  value={newAsset.folder}
                  onChange={(e) => setNewAsset({ ...newAsset, folder: e.target.value })}
                  className="w-full h-10 px-3 rounded-md bg-neutral-900 border border-neutral-800 text-white text-xs focus:ring-1 focus:ring-gold"
                >
                  <option value="products">products</option>
                  <option value="collections">collections</option>
                  <option value="journal">journal</option>
                  <option value="branding">branding</option>
                  <option value="banners">banners</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Alt Text (SEO & Accessibility)
              </label>
              <Input
                value={newAsset.altText}
                onChange={(e) => setNewAsset({ ...newAsset, altText: e.target.value })}
                placeholder="Detailed description of the image content..."
                className="bg-neutral-900 border-neutral-800 text-white text-xs"
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
                disabled={isSubmitting || !newAsset.url}
                className="bg-gold hover:bg-gold-light text-black font-medium text-xs px-5"
              >
                {isSubmitting ? "Adding Asset..." : "Add to Library"}
              </Button>
            </div>
          </form>
        </div>
      </Dialog>

      {/* Preview & Edit Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <div className="p-6 space-y-6 max-w-xl max-h-[90vh] overflow-y-auto">
          {selectedAsset && (
            <>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-light text-white truncate max-w-md">
                    {selectedAsset.filename}
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Uploaded on {new Date(selectedAsset.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Large Image Preview */}
              <div className="rounded-xl border border-white/10 overflow-hidden bg-neutral-900 max-h-72 flex items-center justify-center">
                <img
                  src={selectedAsset.url}
                  alt={selectedAsset.altText || selectedAsset.filename}
                  className="max-h-72 w-full object-contain"
                />
              </div>

              {/* Copy URL Box */}
              <div className="p-3 rounded-lg bg-neutral-900/60 border border-neutral-800 flex items-center justify-between gap-3">
                <span className="text-xs font-mono text-neutral-300 truncate">
                  {selectedAsset.url}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopyUrl(selectedAsset.url)}
                  className="shrink-0 h-8 border-neutral-700 text-xs text-neutral-200"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400 mr-1" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 mr-1" /> Copy URL
                    </>
                  )}
                </Button>
              </div>

              {/* Edit Metadata Form */}
              <form onSubmit={handleSavePreview} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Folder Category
                    </label>
                    <select
                      value={editFolder}
                      onChange={(e) => setEditFolder(e.target.value)}
                      className="w-full h-10 px-3 rounded-md bg-neutral-900 border border-neutral-800 text-white text-xs focus:ring-1 focus:ring-gold"
                    >
                      <option value="products">products</option>
                      <option value="collections">collections</option>
                      <option value="journal">journal</option>
                      <option value="branding">branding</option>
                      <option value="banners">banners</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      File Size
                    </label>
                    <div className="h-10 px-3 rounded-md bg-neutral-900/50 border border-neutral-800 text-neutral-400 text-xs flex items-center font-mono">
                      {formatFileSize(selectedAsset.sizeInBytes)}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Alt Text (Accessibility & SEO)
                  </label>
                  <textarea
                    value={editAltText}
                    onChange={(e) => setEditAltText(e.target.value)}
                    placeholder="Describe image for search engines and screen readers..."
                    rows={2}
                    className="w-full p-3 rounded-md bg-neutral-900 border border-neutral-800 text-white text-xs placeholder:text-neutral-600 focus:ring-1 focus:ring-gold"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleDelete(selectedAsset.id, selectedAsset.filename)}
                    className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Delete Asset
                  </Button>

                  <div className="flex items-center gap-2">
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
            </>
          )}
        </div>
      </Dialog>
    </div>
  );
}
