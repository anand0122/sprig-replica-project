import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Copy, 
  Code, 
  ExternalLink, 
  Eye, 
  Settings,
  Palette,
  Monitor,
  Smartphone,
  CheckCircle
} from "lucide-react";

const FormEmbed = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<any>(null);
  const [embedSettings, setEmbedSettings] = useState({
    width: '100%',
    height: '600px',
    theme: 'light',
    showTitle: true,
    showDescription: true,
    borderRadius: '8px',
    primaryColor: '#3b82f6',
    backgroundColor: '#ffffff'
  });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    loadForm();
  }, [id]);

  const loadForm = () => {
    try {
      const savedForms = JSON.parse(localStorage.getItem('savedForms') || '[]');
      const foundForm = savedForms.find((f: any) => f.id === id);
      
      if (foundForm) {
        setForm(foundForm);
      } else {
        navigate('/forms');
      }
    } catch (error) {
      console.error('Error loading form:', error);
      navigate('/forms');
    }
  };

  const generateEmbedUrl = () => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      theme: embedSettings.theme,
      showTitle: embedSettings.showTitle.toString(),
      showDescription: embedSettings.showDescription.toString(),
      primaryColor: embedSettings.primaryColor.replace('#', ''),
      backgroundColor: embedSettings.backgroundColor.replace('#', '')
    });
    return `${baseUrl}/embed/${id}?${params.toString()}`;
  };

  const generateIframeCode = () => {
    const embedUrl = generateEmbedUrl();
    return `<iframe 
  src="${embedUrl}" 
  width="${embedSettings.width}" 
  height="${embedSettings.height}" 
  frameborder="0" 
  style="border-radius: ${embedSettings.borderRadius}; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
</iframe>`;
  };

  const generateScriptCode = () => {
    const baseUrl = window.location.origin;
    return `<script src="${baseUrl}/embed-script.js"></script>
<script>
  FormPulseEmbed.init({
    formId: "${id}",
    container: "#form-container",
    theme: "${embedSettings.theme}",
    showTitle: ${embedSettings.showTitle},
    showDescription: ${embedSettings.showDescription},
    primaryColor: "${embedSettings.primaryColor}",
    backgroundColor: "${embedSettings.backgroundColor}",
    borderRadius: "${embedSettings.borderRadius}",
    onSubmit: function(data) {
      console.log('Form submitted:', data);
      // Handle form submission
    }
  });
</script>

<!-- Add this div where you want the form to appear -->
<div id="form-container"></div>`;
  };

  const generateReactCode = () => {
    return `import React from 'react';

const EmbeddedForm = () => {
  return (
    <iframe 
      src="${generateEmbedUrl()}" 
      width="${embedSettings.width}" 
      height="${embedSettings.height}" 
      frameBorder="0" 
      style={{
        borderRadius: '${embedSettings.borderRadius}',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}
    />
  );
};

export default EmbeddedForm;`;
  };

  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (!form) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/forms')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forms
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
            <p className="text-gray-600">Embed this form on your website</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open(generateEmbedUrl(), '_blank')}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open(`/form/${id}`, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Form
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Embed Settings */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Embed Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Dimensions */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Dimensions</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-gray-600">Width</Label>
                    <Input
                      value={embedSettings.width}
                      onChange={(e) => setEmbedSettings({...embedSettings, width: e.target.value})}
                      placeholder="100%"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Height</Label>
                    <Input
                      value={embedSettings.height}
                      onChange={(e) => setEmbedSettings({...embedSettings, height: e.target.value})}
                      placeholder="600px"
                    />
                  </div>
                </div>
              </div>

              {/* Theme */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Theme</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={embedSettings.theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setEmbedSettings({...embedSettings, theme: 'light'})}
                  >
                    Light
                  </Button>
                  <Button
                    variant={embedSettings.theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setEmbedSettings({...embedSettings, theme: 'dark'})}
                  >
                    Dark
                  </Button>
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Colors</Label>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs text-gray-600">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={embedSettings.primaryColor}
                        onChange={(e) => setEmbedSettings({...embedSettings, primaryColor: e.target.value})}
                        className="w-12 h-8 p-1"
                      />
                      <Input
                        value={embedSettings.primaryColor}
                        onChange={(e) => setEmbedSettings({...embedSettings, primaryColor: e.target.value})}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Background Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={embedSettings.backgroundColor}
                        onChange={(e) => setEmbedSettings({...embedSettings, backgroundColor: e.target.value})}
                        className="w-12 h-8 p-1"
                      />
                      <Input
                        value={embedSettings.backgroundColor}
                        onChange={(e) => setEmbedSettings({...embedSettings, backgroundColor: e.target.value})}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Display Options */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Display Options</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Show Title</Label>
                    <input
                      type="checkbox"
                      checked={embedSettings.showTitle}
                      onChange={(e) => setEmbedSettings({...embedSettings, showTitle: e.target.checked})}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Show Description</Label>
                    <input
                      type="checkbox"
                      checked={embedSettings.showDescription}
                      onChange={(e) => setEmbedSettings({...embedSettings, showDescription: e.target.checked})}
                      className="rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Border Radius */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Border Radius</Label>
                <Input
                  value={embedSettings.borderRadius}
                  onChange={(e) => setEmbedSettings({...embedSettings, borderRadius: e.target.value})}
                  placeholder="8px"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Embed Codes */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="iframe" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="iframe">iFrame Embed</TabsTrigger>
              <TabsTrigger value="script">JavaScript</TabsTrigger>
              <TabsTrigger value="react">React Component</TabsTrigger>
            </TabsList>

            <TabsContent value="iframe" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      iFrame Embed Code
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generateIframeCode(), 'iframe')}
                    >
                      {copiedCode === 'iframe' ? (
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 mr-2" />
                      )}
                      {copiedCode === 'iframe' ? 'Copied!' : 'Copy Code'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre>{generateIframeCode()}</pre>
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">How to use:</h4>
                    <ol className="text-sm text-blue-800 space-y-1">
                      <li>1. Copy the code above</li>
                      <li>2. Paste it into your HTML where you want the form to appear</li>
                      <li>3. The form will automatically load and be ready to use</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="script" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      JavaScript Embed Code
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generateScriptCode(), 'script')}
                    >
                      {copiedCode === 'script' ? (
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 mr-2" />
                      )}
                      {copiedCode === 'script' ? 'Copied!' : 'Copy Code'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre>{generateScriptCode()}</pre>
                  </div>
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Advanced Integration:</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• More customization options available</li>
                      <li>• Custom event handlers for form submission</li>
                      <li>• Dynamic styling and behavior</li>
                      <li>• Better integration with existing JavaScript</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="react" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      React Component
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generateReactCode(), 'react')}
                    >
                      {copiedCode === 'react' ? (
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 mr-2" />
                      )}
                      {copiedCode === 'react' ? 'Copied!' : 'Copy Code'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre>{generateReactCode()}</pre>
                  </div>
                  <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">React Integration:</h4>
                    <ul className="text-sm text-purple-800 space-y-1">
                      <li>• Copy the component code above</li>
                      <li>• Import and use in your React application</li>
                      <li>• Fully responsive and customizable</li>
                      <li>• TypeScript support available</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-4">Preview how your form will look when embedded</p>
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(generateEmbedUrl(), '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const previewWindow = window.open('', '_blank', 'width=800,height=600');
                        if (previewWindow) {
                          previewWindow.document.write(`
                            <!DOCTYPE html>
                            <html>
                            <head>
                              <title>Form Preview</title>
                              <style>
                                body { margin: 20px; font-family: Arial, sans-serif; }
                                .container { max-width: 600px; margin: 0 auto; }
                              </style>
                            </head>
                            <body>
                              <div class="container">
                                <h2>Embedded Form Preview</h2>
                                ${generateIframeCode()}
                              </div>
                            </body>
                            </html>
                          `);
                          previewWindow.document.close();
                        }
                      }}
                    >
                      <Smartphone className="w-4 h-4 mr-2" />
                      Quick Preview
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Embed Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-600">Total Embeds</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">Form Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">0</div>
              <div className="text-sm text-gray-600">Submissions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">0%</div>
              <div className="text-sm text-gray-600">Conversion Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormEmbed; 