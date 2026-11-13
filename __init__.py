from .version import __version__, __creator__
import time

_START_TIME = time.perf_counter()

print(f"\033[90m[ComfyUI-Minimize-Shortcut BY {__creator__}][VERSION {__version__}] Loading...\033[0m")

WEB_DIRECTORY = "./web"

NODE_CLASS_MAPPINGS = {}
NODE_DISPLAY_NAME_MAPPINGS = {}

_LOAD_TIME = time.perf_counter() - _START_TIME

print(
    f"\033[92m[ComfyUI-Minimize-Shortcut BY {__creator__}][VERSION {__version__}] "
    f"Loaded in {_LOAD_TIME:.4f}s\033[0m"
)
