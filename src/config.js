const config = {
  apiUrl: process.env.REACT_APP_API_URI,
  supportEmail: process.env.REACT_APP_SUPPORT_EMAIL,
  adminEnabled: process.env.REACT_APP_ADMIN_ENABLED === "true",
  sdlTranslateEnabled: process.env.REACT_APP_SDL_TRANSLATE_ENABLED === "true",
  googleTranslateEnabled: process.env.REACT_APP_GOOGLE_TRANSLATE_ENABLED === "true",
  display: process.env.REACT_APP_DISPLAY,
  fileUploadMaxFileSize: Number(process.env.REACT_APP_FILE_UPLOAD_MAX_SIZE_BYTES), 
  fileUploadMaxFiles: Number(process.env.REACT_APP_FILE_MAX_FILES), 
};

export default config;
