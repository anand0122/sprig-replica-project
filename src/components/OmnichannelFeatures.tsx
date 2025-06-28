import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  MessageCircle, 
  QrCode, 
  Mic, 
  MicOff, 
  Share2, 
  Copy, 
  Download,
  Phone,
  Mail,
  Globe,
  Smartphone,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface QRCodeOptions {
  size: number;
  backgroundColor: string;
  foregroundColor: string;
  logo?: string;
  margin: number;
}

interface WhatsAppMessage {
  text: string;
  formUrl: string;
  customMessage?: string;
}

interface VoiceRecording {
  id: string;
  transcript: string;
  confidence: number;
  duration: number;
  audioBlob?: Blob;
  detectedFields: {
    fieldName: string;
    value: string;
    confidence: number;
  }[];
}

interface OmnichannelFeaturesProps {
  formId: string;
  formTitle: string;
  formUrl: string;
}

export const OmnichannelFeatures: React.FC<OmnichannelFeaturesProps> = ({
  formId,
  formTitle,
  formUrl
}) => {
  const [qrOptions, setQrOptions] = useState<QRCodeOptions>({
    size: 200,
    backgroundColor: '#ffffff',
    foregroundColor: '#000000',
    margin: 4
  });

  const [whatsappMessage, setWhatsappMessage] = useState<WhatsAppMessage>({
    text: `Check out this form: ${formTitle}`,
    formUrl,
    customMessage: ''
  });

  const [isRecording, setIsRecording] = useState(false);
  const [voiceRecordings, setVoiceRecordings] = useState<VoiceRecording[]>([]);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [speechEnabled, setSpeechEnabled] = useState(true);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // QR Code Generation
  const generateQRCode = () => {
    // In a real implementation, this would use a QR code library
    const qrData = encodeURIComponent(formUrl);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrOptions.size}x${qrOptions.size}&data=${qrData}&bgcolor=${qrOptions.backgroundColor.replace('#', '')}&color=${qrOptions.foregroundColor.replace('#', '')}&margin=${qrOptions.margin}`;
    return qrUrl;
  };

  const downloadQRCode = async () => {
    const qrUrl = generateQRCode();
    const response = await fetch(qrUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formTitle}-qr-code.png`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // WhatsApp Sharing
  const shareOnWhatsApp = () => {
    const message = whatsappMessage.customMessage || whatsappMessage.text;
    const encodedMessage = encodeURIComponent(`${message}\n\n${formUrl}`);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareViaSMS = () => {
    const message = whatsappMessage.customMessage || whatsappMessage.text;
    const encodedMessage = encodeURIComponent(`${message}\n\n${formUrl}`);
    const smsUrl = `sms:?body=${encodedMessage}`;
    window.open(smsUrl);
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Form: ${formTitle}`);
    const body = encodeURIComponent(`${whatsappMessage.customMessage || whatsappMessage.text}\n\n${formUrl}`);
    const emailUrl = `mailto:?subject=${subject}&body=${body}`;
    window.open(emailUrl);
  };

  // Voice-to-Form functionality
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        processVoiceRecording(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const processVoiceRecording = async (audioBlob: Blob) => {
    // Mock voice processing - in real implementation, this would use speech recognition API
    const mockTranscript = "My name is John Doe, my email is john@example.com, and I'm interested in your premium plan.";
    const mockFields = [
      { fieldName: 'name', value: 'John Doe', confidence: 0.95 },
      { fieldName: 'email', value: 'john@example.com', confidence: 0.92 },
      { fieldName: 'interest', value: 'premium plan', confidence: 0.88 }
    ];

    const newRecording: VoiceRecording = {
      id: crypto.randomUUID(),
      transcript: mockTranscript,
      confidence: 0.92,
      duration: 15, // seconds
      audioBlob,
      detectedFields: mockFields
    };

    setVoiceRecordings(prev => [newRecording, ...prev]);

    // Speak confirmation if enabled
    if (speechEnabled) {
      speakText("Recording processed. I've detected some information that can be used to pre-fill the form.");
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window && speechEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const playRecording = (recordingId: string) => {
    const recording = voiceRecordings.find(r => r.id === recordingId);
    if (recording?.audioBlob) {
      const audio = new Audio(URL.createObjectURL(recording.audioBlob));
      audio.play();
      setIsPlaying(recordingId);
      audio.onended = () => setIsPlaying(null);
    }
  };

  const applyVoiceData = (recording: VoiceRecording) => {
    // In real implementation, this would populate form fields
    const fieldsApplied = recording.detectedFields.length;
    alert(`Applied ${fieldsApplied} fields from voice recording to the form.`);
    
    if (speechEnabled) {
      speakText(`Applied ${fieldsApplied} fields to your form. Please review and submit when ready.`);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Omnichannel Sharing
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="whatsapp" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="whatsapp">Messaging</TabsTrigger>
            <TabsTrigger value="qr">QR Code</TabsTrigger>
            <TabsTrigger value="voice">Voice-to-Form</TabsTrigger>
          </TabsList>

          <TabsContent value="whatsapp" className="space-y-6">
            <div>
              <h3 className="font-medium mb-4">Share via Messaging Platforms</h3>
              
              <div className="space-y-4">
                <div>
                  <Label>Custom Message</Label>
                  <Input
                    value={whatsappMessage.customMessage}
                    onChange={(e) => setWhatsappMessage(prev => ({ ...prev, customMessage: e.target.value }))}
                    placeholder={whatsappMessage.text}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button
                    onClick={shareOnWhatsApp}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </Button>
                  
                  <Button
                    onClick={shareViaSMS}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    SMS
                  </Button>
                  
                  <Button
                    onClick={shareViaEmail}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </Button>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <Label className="text-sm font-medium">Preview Message:</Label>
                  <p className="text-sm text-gray-700 mt-1">
                    {whatsappMessage.customMessage || whatsappMessage.text}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">{formUrl}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(formUrl)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(`${whatsappMessage.customMessage || whatsappMessage.text}\n\n${formUrl}`)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Message
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="qr" className="space-y-6">
            <div>
              <h3 className="font-medium mb-4">QR Code Generation</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Size (pixels)</Label>
                    <Input
                      type="number"
                      value={qrOptions.size}
                      onChange={(e) => setQrOptions(prev => ({ ...prev, size: parseInt(e.target.value) }))}
                      min="100"
                      max="500"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label>Background Color</Label>
                    <Input
                      type="color"
                      value={qrOptions.backgroundColor}
                      onChange={(e) => setQrOptions(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label>Foreground Color</Label>
                    <Input
                      type="color"
                      value={qrOptions.foregroundColor}
                      onChange={(e) => setQrOptions(prev => ({ ...prev, foregroundColor: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label>Margin</Label>
                    <Input
                      type="number"
                      value={qrOptions.margin}
                      onChange={(e) => setQrOptions(prev => ({ ...prev, margin: parseInt(e.target.value) }))}
                      min="0"
                      max="10"
                      className="mt-1"
                    />
                  </div>

                  <Button onClick={downloadQRCode} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download QR Code
                  </Button>
                </div>

                <div className="flex flex-col items-center">
                  <div className="p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg">
                    <img
                      src={generateQRCode()}
                      alt="QR Code"
                      className="max-w-full h-auto"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    Scan to access form on mobile devices
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Use Cases:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Print on business cards or flyers</li>
                  <li>• Display at events or conferences</li>
                  <li>• Include in presentations</li>
                  <li>• Add to product packaging</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="voice" className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Voice-to-Form</h3>
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Speech Feedback</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSpeechEnabled(!speechEnabled)}
                  >
                    {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <Button
                    size="lg"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-20 h-20 rounded-full ${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                  </Button>
                </div>
                
                <p className="text-sm text-gray-600">
                  {isRecording 
                    ? 'Recording... Click to stop' 
                    : 'Click to start recording. Speak naturally and mention your details.'
                  }
                </p>

                {!isRecording && (
                  <div className="text-xs text-gray-500">
                    Example: "My name is John Smith, email john@example.com, and I'm interested in the premium package."
                  </div>
                )}
              </div>

              {voiceRecordings.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium">Voice Recordings</h4>
                  {voiceRecordings.map((recording) => (
                    <Card key={recording.id} className="border-l-4 border-l-green-500">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {recording.duration}s
                            </Badge>
                            <Badge variant="secondary">
                              {Math.round(recording.confidence * 100)}% confidence
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => playRecording(recording.id)}
                              disabled={isPlaying === recording.id}
                            >
                              {isPlaying === recording.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => applyVoiceData(recording)}
                            >
                              Apply to Form
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm font-medium">Transcript:</Label>
                            <p className="text-sm text-gray-700 mt-1">{recording.transcript}</p>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">Detected Fields:</Label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                              {recording.detectedFields.map((field, index) => (
                                <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                                  <div className="font-medium">{field.fieldName}</div>
                                  <div className="text-gray-600">{field.value}</div>
                                  <div className="text-xs text-gray-500">
                                    {Math.round(field.confidence * 100)}% confidence
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">How it works:</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Speak naturally mentioning your details</li>
                  <li>• AI extracts relevant information</li>
                  <li>• Fields are automatically pre-filled</li>
                  <li>• Review and submit the form</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}; 