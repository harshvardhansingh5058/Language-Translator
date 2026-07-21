const BASE_URL = "https://translate.googleapis.com/translate_a/single"

// Get DOM elements
const sourceLang   = document.getElementById("source-lang")
const targetLang   = document.getElementById("target-lang")
const inputText    = document.getElementById("input-text")
const showOutput   = document.getElementById("output-text")
const translateBtn = document.getElementById("translate-btn")
const clearBtn     = document.getElementById("clear-btn")
const swapBtn      = document.getElementById("swap-btn")
const copyBtn      = document.getElementById("copy-btn")
const charCount    = document.querySelector(".char-count")
const toast        = document.getElementById("toast")

// ── Translate ────────────────────────────────────────────────────
translateBtn.addEventListener("click", async () => {
    const raw = inputText.value.trim()
    if (!raw) {
        showToast("Please enter some text first.")
        return
    }

    // Loading state
    translateBtn.querySelector(".btn-label").textContent = "Translating…"
    translateBtn.querySelector(".btn-loader").classList.remove("hidden")
    translateBtn.disabled = true

    const text   = encodeURIComponent(raw)
    const source = sourceLang.value
    const target = targetLang.value

    try {
        const response = await fetch(
            `${BASE_URL}?client=gtx&sl=${source}&tl=${target}&dt=t&q=${text}`
        )
        const data = await response.json()
        // data[0] is an array of [translatedChunk, originalChunk, …] pairs
        const translatedText = data[0].map(chunk => chunk[0]).join("")
        showOutput.value = translatedText
        copyBtn.disabled = false
    } catch (err) {
        console.error("Translation error:", err)
        showToast("Translation failed. Please try again.")
    } finally {
        translateBtn.querySelector(".btn-label").textContent = "Translate"
        translateBtn.querySelector(".btn-loader").classList.add("hidden")
        translateBtn.disabled = false
    }
})

// ── Clear ────────────────────────────────────────────────────────
clearBtn.addEventListener("click", () => {
    inputText.value  = ""
    showOutput.value = ""
    copyBtn.disabled = true
    if (charCount) charCount.textContent = "0/500"
    inputText.focus()
})

// ── Character count ──────────────────────────────────────────────
if (inputText && charCount) {
    inputText.addEventListener("input", () => {
        charCount.textContent = `${inputText.value.length}/500`
    })
}

// ── Swap ─────────────────────────────────────────────────────────
swapBtn.addEventListener("click", () => {
    // Swap language selections
    const tempLang     = sourceLang.value
    sourceLang.value   = targetLang.value
    targetLang.value   = tempLang

    // Swap text content
    const tempText     = inputText.value
    inputText.value    = showOutput.value
    showOutput.value   = tempText

    // Update char count
    if (charCount) charCount.textContent = `${inputText.value.length}/500`

    // Enable/disable copy appropriately
    copyBtn.disabled = !showOutput.value.trim()
})

// ── Copy ─────────────────────────────────────────────────────────
copyBtn.addEventListener("click", async () => {
    if (!showOutput.value.trim()) return
    try {
        await navigator.clipboard.writeText(showOutput.value)
        showToast("Copied to clipboard!")
    } catch (err) {
        showOutput.select()
        document.execCommand("copy")
        showToast("Copied!")
    }
})

// ── Toast helper ─────────────────────────────────────────────────
function showToast(message) {
    toast.textContent = message
    toast.classList.remove("hidden")
    clearTimeout(toast._timer)
    toast._timer = setTimeout(() => toast.classList.add("hidden"), 2800)
}