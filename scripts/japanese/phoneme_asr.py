"""IPA phoneme recognition (wav2vec2-xlsr-53-espeak-cv-ft) with a hand-rolled CTC decoder,
so the phonemizer/espeak dependency of the HF tokenizer is not needed for decoding."""
import json, sys, torch, librosa
from huggingface_hub import hf_hub_download
from transformers import AutoModelForCTC
MID = "facebook/wav2vec2-xlsr-53-espeak-cv-ft"
_vocab = json.load(open(hf_hub_download(MID, "vocab.json")))
_id2tok = {v: k for k, v in _vocab.items()}
_model = AutoModelForCTC.from_pretrained(MID).eval()
_blank = _vocab.get("<pad>", 0)

def recognize(path):
    y, sr = librosa.load(path, sr=16000)
    y = (y - y.mean()) / (y.std() + 1e-7)  # feature extractor normalization
    with torch.no_grad():
        ids = torch.argmax(_model(torch.tensor(y)[None]).logits, dim=-1)[0].tolist()
    out, prev = [], None
    for i in ids:
        if i != prev and i != _blank:
            t = _id2tok.get(i, "")
            if t not in ("<s>", "</s>", "<unk>", "|"):
                out.append(t)
        prev = i
    return out

if __name__ == "__main__":
    for p in sys.argv[1:]:
        print(p.split("/")[-1], "->", " ".join(recognize(p)))
