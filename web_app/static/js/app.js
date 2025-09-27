// /static/js/app.js
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // -----------------------------
  // Shortcuts
  // -----------------------------
  const qs = (sel, el = document) => el.querySelector(sel);
  const qsa = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  const setText = (el, text) => { if (el) el.textContent = text ?? "—"; };
  const show = (el) => el && el.classList.remove("is-hidden");
  const hide = (el) => el && el.classList.add("is-hidden");

  // -----------------------------
  // Elements (Uploader)
  // -----------------------------
  const uploadModeInputs = qsa('input[name="upload-mode"]');
  const uploadForm = qs("#uploadForm");
  const fileInputRow = qs('.form-row[data-mode="file"]');
  const urlInputRow = qs('.form-row[data-mode="url"]');
  const fileInput = qs("#fileInput");
  const bucketUrl = qs("#bucketUrl");
  const btnUpload = qs("#btnUpload");
  const btnResetUpload = qs("#btnResetUpload");
  const uploadStatus = qs("#uploadStatus");
  const uploadMeta = qs("#uploadMeta");

  // -----------------------------
  // Elements (Schema & Processing)
  // -----------------------------
  const fileIdSpan = qs("#fileId");
  const engineNameSpan = qs("#engineName");
  const rowCountSpan = qs("#rowCount");
  const schemaTableBody = qs("#schemaTable tbody");

  const processForm = qs("#processForm");
  const albedoInput = qs("#albedo");
  const autoDeriveInput = qs("#autoDerive");
  const processStatus = qs("#processStatus");
  const processMeta = qs("#processMeta");

  // -----------------------------
  // Elements (Results)
  // -----------------------------
  const linkResultsPage = qs("#linkResultsPage");
  const linkDownloadCSV = qs("#linkDownloadCSV");
  const linkDownloadJSON = qs("#linkDownloadJSON");

  // -----------------------------
  // State
  // -----------------------------
  let currentFileId = null;
  let currentEngine = null;
  let currentRowCount = null;

  // -----------------------------
  // UI Helpers
  // -----------------------------
  function setStatus(el, message, type = "info") {
    if (!el) return;
    el.className = `status status--${type}`;
    el.textContent = message;
  }

  function clearTable(tbody) {
    if (!tbody) return;
    while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
  }

  function addSchemaRow(tbody, detected, mappedTo, status) {
    const tr = document.createElement("tr");
    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    td1.textContent = detected ?? "—";
    td2.textContent = mappedTo ?? "—";
    td3.textContent = status ?? "ok";
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tbody.appendChild(tr);
  }

  function fillSchemaTable(detectedColumns) {
    clearTable(schemaTableBody);
    if (!detectedColumns || detectedColumns.length === 0) {
      addSchemaRow(schemaTableBody, "—", "—", "no columns detected");
      return;
    }

    // Support two shapes:
    // 1) [{detected: "...", mapped_to: "...", status: "ok"}]
    // 2) ["raw_name", ...] -> we show raw_name and "mapped" = same/raw
    detectedColumns.forEach((col) => {
      if (typeof col === "string") {
        addSchemaRow(schemaTableBody, col, col, "ok");
      } else if (col && typeof col === "object") {
        addSchemaRow(
          schemaTableBody,
          col.detected ?? col.source ?? "—",
          col.mapped_to ?? col.mapped ?? col.target ?? "—",
          col.status ?? "ok"
        );
      }
    });
  }

  function resetUploadUI() {
    currentFileId = null;
    currentEngine = null;
    currentRowCount = null;
    setText(fileIdSpan, "—");
    setText(engineNameSpan, "—");
    setText(rowCountSpan, "—");
    clearTable(schemaTableBody);
    uploadForm.reset();
    processForm.reset();
    setStatus(uploadStatus, "Waiting for input…", "info");
    uploadMeta.textContent = "";
    processMeta.textContent = "";
    setStatus(processStatus, "Idle.", "info");
    // Reset result links
    linkDownloadCSV.setAttribute("href", "#");
    linkDownloadJSON.setAttribute("href", "#");
  }

  // -----------------------------
  // Upload mode toggle
  // -----------------------------
  function updateUploadMode() {
    const checked = uploadModeInputs.find((x) => x.checked);
    const mode = checked ? checked.value : "file";
    if (mode === "file") {
      show(fileInputRow);
      hide(urlInputRow);
    } else {
      hide(fileInputRow);
      show(urlInputRow);
    }
  }

  uploadModeInputs.forEach((input) => {
    input.addEventListener("change", updateUploadMode);
  });
  updateUploadMode();

  // -----------------------------
  // Upload handler
  // -----------------------------
  uploadForm.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    setStatus(uploadStatus, "Uploading…", "info");
    uploadMeta.textContent = "";

    try {
      const checked = uploadModeInputs.find((x) => x.checked);
      const mode = checked ? checked.value : "file";

      let resp;
      if (mode === "file") {
        const file = fileInput.files && fileInput.files[0];
        if (!file) {
          setStatus(uploadStatus, "Please select a .csv or .parquet file.", "warn");
          return;
        }
        const formData = new FormData();
        formData.append("file", file);
        resp = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
      } else {
        const url = (bucketUrl.value || "").trim();
        if (!url) {
          setStatus(uploadStatus, "Please provide a bucket URL.", "warn");
          return;
        }
        resp = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
      }

      if (!resp.ok) {
        const text = await safeText(resp);
        throw new Error(`Upload failed (${resp.status}): ${text}`);
      }

      const data = await resp.json();
      // Expected: { file_id, detected_columns, engine, rows? }
      currentFileId = data.file_id || data.id || null;
      currentEngine = data.engine || "pandas";
      currentRowCount = data.rows ?? data.row_count ?? null;

      setText(fileIdSpan, currentFileId || "—");
      setText(engineNameSpan, currentEngine || "—");
      setText(rowCountSpan, currentRowCount ?? "—");

      fillSchemaTable(data.detected_columns || data.columns || []);

      setStatus(uploadStatus, "Upload successful.", "success");
      uploadMeta.textContent = JSON.stringify(
        {
          file_id: currentFileId,
          engine: currentEngine,
          rows: currentRowCount,
        },
        null,
        2
      );

    } catch (err) {
      console.error(err);
      setStatus(uploadStatus, err.message || "Upload error.", "error");
    }
  });

  btnResetUpload.addEventListener("click", () => {
    resetUploadUI();
  });

  // -----------------------------
  // Process handler
  // -----------------------------
  processForm.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    if (!currentFileId) {
      setStatus(processStatus, "Please upload a dataset first.", "warn");
      return;
    }

    const albedo = parseFloat(albedoInput.value || "0.3");
    const autoDerive = !!autoDeriveInput.checked;

    setStatus(processStatus, "Processing…", "info");
    processMeta.textContent = "";

    try {
      const resp = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file_id: currentFileId,
          assumptions: { albedo },
          options: { auto_derive: autoDerive },
        }),
      });

      if (!resp.ok) {
        const text = await safeText(resp);
        throw new Error(`Process failed (${resp.status}): ${text}`);
      }

      const data = await resp.json();
      // Expected: { job_id, engine, rows } or directly results with csv_path/json_path
      if (data.csv_path || data.json_path) {
        publishResultLinks(data.csv_path, data.json_path);
        setStatus(processStatus, "Processing complete.", "success");
        processMeta.textContent = JSON.stringify(data, null, 2);
        return;
      }

      const jobId = data.job_id || data.id;
      if (!jobId) {
        // Nothing to poll; still publish whatever we have
        publishResultLinks(data.csv_path, data.json_path);
        setStatus(processStatus, "Processed (no job id returned).", "success");
        processMeta.textContent = JSON.stringify(data, null, 2);
        return;
      }

      // Poll results if a job id is returned
      setStatus(processStatus, `Queued (job: ${jobId}). Polling results…`, "info");
      const result = await pollResults(jobId, 10, 1500); // 10 attempts, 1.5s interval
      publishResultLinks(result.csv_path, result.json_path);
      setStatus(processStatus, "Processing complete.", "success");
      processMeta.textContent = JSON.stringify(result, null, 2);

    } catch (err) {
      console.error(err);
      setStatus(processStatus, err.message || "Processing error.", "error");
    }
  });

  qs("#btnCancelProcess")?.addEventListener("click", () => {
    setStatus(processStatus, "Cancelled by user.", "warn");
  });

  // -----------------------------
  // Helpers: results
  // -----------------------------
  function publishResultLinks(csvPath, jsonPath) {
    if (csvPath) {
      linkDownloadCSV.setAttribute("href", csvPath);
    } else {
      linkDownloadCSV.setAttribute("href", "#");
    }
    if (jsonPath) {
      linkDownloadJSON.setAttribute("href", jsonPath);
    } else {
      linkDownloadJSON.setAttribute("href", "#");
    }
  }

  async function pollResults(jobId, maxAttempts = 10, delayMs = 1500) {
    let attempt = 0;
    while (attempt < maxAttempts) {
      attempt += 1;
      const url = `/api/result/${encodeURIComponent(jobId)}`;
      const resp = await fetch(url, { method: "GET" });
      if (resp.ok) {
        const data = await resp.json();
        // Expect {summary, csv_path, json_path, status?}
        if (data.csv_path || data.json_path || (data.status && data.status === "done")) {
          return data;
        }
      }
      await sleep(delayMs);
    }
    throw new Error("Result polling exceeded attempts.");
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function safeText(resp) {
    try {
      return await resp.text();
    } catch {
      return "";
    }
  }

  // -----------------------------
  // Optional: quick check of backend
  // -----------------------------
  quickHealthCheck().catch(() => {
    // ignore; non-fatal for UI
  });

  async function quickHealthCheck() {
    const resp = await fetch("/healthz");
    if (resp.ok) {
      const info = await resp.json();
      console.log("Backend health:", info);
    }
  }
});
